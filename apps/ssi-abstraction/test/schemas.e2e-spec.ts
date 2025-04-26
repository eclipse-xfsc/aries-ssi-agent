import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';

import { natsConfig } from '../dist/config/nats.config.js';
import { AgentModule } from '../src/agent/agent.module.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { SchemasModule } from '../src/agent/schemas/schemas.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Schemas', () => {
  const TOKEN = 'SCHEMAS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;
  let issuerDid: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004, true),

        AgentModule,
        SchemasModule,
        TenantsModule,
        DidsModule,

        ClientsModule.registerAsync({
          clients: [
            {
              name: TOKEN,
              inject: [natsConfig.KEY],
              useFactory: ({
                url,
                user,
                password,
              }: ConfigType<typeof natsConfig>) => ({
                transport: Transport.NATS,
                options: { servers: [url], user, pass: password },
              }),
            },
          ],
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    const natsOptions = app.get(natsConfig.KEY);
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        servers: [natsOptions.url],
        user: natsOptions.user,
        pass: natsOptions.password,
      },
    });

    await app.startAllMicroservices();
    await app.init();

    client = app.get(TOKEN);
    await client.connect();

    const ts = app.get(TenantsService);
    const { id } = await ts.create({ label: TOKEN });
    tenantId = id;

    const ds = app.get(DidsService);

    await ds.registerEndorserDids();
    const [did] = await ds.registerDidIndyFromSeed({
      tenantId,
      seed: randomBytes(16).toString('hex'),
    });
    issuerDid = did;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventAnonCredsSchemasGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsSchemasGetAll,
      EventAnonCredsSchemasGetAllInput
    >(EventAnonCredsSchemasGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsSchemasGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsSchemasGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsSchemasGetById,
      EventAnonCredsSchemasGetByIdInput
    >(EventAnonCredsSchemasGetById.token, { tenantId, schemaId: 'some-id' });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsSchemasGetById.fromEvent(response);

    expect(eventInstance.instance).toEqual(null);
  });

  it(EventAnonCredsSchemasRegister.token, async () => {
    const version = `1.${Date.now()}`;
    const attributeNames = ['names', 'age'];
    const name = 'my-schema';
    const response$ = client.send<
      EventAnonCredsSchemasRegister,
      EventAnonCredsSchemasRegisterInput
    >(EventAnonCredsSchemasRegister.token, {
      tenantId,
      name,
      version,
      issuerDid,
      attributeNames,
    });

    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsSchemasRegister.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      attrNames: attributeNames,
      issuerId: issuerDid,
      name,
      version,
    });
  });
});
