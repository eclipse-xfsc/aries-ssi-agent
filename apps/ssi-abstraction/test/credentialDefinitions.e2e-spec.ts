import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventAnonCredsCredentialDefinitionsGetAllInput,
  EventAnonCredsCredentialDefinitionsGetByIdInput,
  EventAnonCredsCredentialDefinitionsRegisterInput,
} from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventAnonCredsCredentialDefinitionsGetById,
  EventAnonCredsCredentialDefinitionsGetAll,
  EventAnonCredsCredentialDefinitionsRegister,
} from '@ocm/shared';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';

import { natsConfig } from '../dist/config/nats.config.js';
import { AgentModule } from '../src/agent/agent.module.js';
import { CredentialDefinitionsModule } from '../src/agent/credentialDefinitions/credentialDefinitions.module.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { SchemasModule } from '../src/agent/schemas/schemas.module.js';
import { SchemasService } from '../src/agent/schemas/schemas.service.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('CredentialDefinitions', () => {
  const TOKEN = 'CREDENTIAL_DEFINITIONS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;

  let issuerDid: string;
  let schemaId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004, true),

        AgentModule,
        SchemasModule,
        CredentialDefinitionsModule,
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

    const tenantsService = app.get(TenantsService);
    const { id } = await tenantsService.create({ label: TOKEN });
    tenantId = id;

    const ds = app.get(DidsService);
    await ds.registerEndorserDids();
    const [did] = await ds.registerDidIndyFromSeed({
      tenantId,
      seed: randomBytes(16).toString('hex'),
    });
    issuerDid = did;

    const schemaService = app.get(SchemasService);
    const { schemaId: sid } = await schemaService.register({
      issuerDid,
      tenantId,
      name: 'test-schema-name',
      version: `1.${Date.now()}`,
      attributeNames: ['none'],
    });
    schemaId = sid;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventAnonCredsCredentialDefinitionsGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialDefinitionsGetAll,
      EventAnonCredsCredentialDefinitionsGetAllInput
    >(EventAnonCredsCredentialDefinitionsGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialDefinitionsGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsCredentialDefinitionsGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialDefinitionsGetById,
      EventAnonCredsCredentialDefinitionsGetByIdInput
    >(EventAnonCredsCredentialDefinitionsGetById.token, {
      tenantId,
      credentialDefinitionId: 'some-id',
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialDefinitionsGetById.fromEvent(response);

    expect(eventInstance.instance).toEqual(null);
  });

  it(EventAnonCredsCredentialDefinitionsRegister.token, async () => {
    const tag = `tag:${Date.now()}`;
    const response$ = client.send<
      EventAnonCredsCredentialDefinitionsRegister,
      EventAnonCredsCredentialDefinitionsRegisterInput
    >(EventAnonCredsCredentialDefinitionsRegister.token, {
      supportsRevocation: false,
      tenantId,
      schemaId,
      issuerDid,
      tag,
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialDefinitionsRegister.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      schemaId,
      tag,
      issuerId: issuerDid,
      type: 'CL',
    });
  });
});
