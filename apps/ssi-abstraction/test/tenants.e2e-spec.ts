import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventTenantsCreateInput,
  EventTenantsGetAllTenantIdsInput,
} from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { EventTenantsGetAllTenantIds, EventTenantsCreate } from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { natsConfig } from '../dist/config/nats.config.js';
import { AgentModule } from '../src/agent/agent.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Tenants', () => {
  const TOKEN = 'TENANTS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3005),

        AgentModule,
        TenantsModule,

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
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventTenantsCreate.token, async () => {
    const response$ = client.send<EventTenantsCreate, EventTenantsCreateInput>(
      EventTenantsCreate.token,
      {
        label: 'my-new-tenant',
      },
    );

    const response = await firstValueFrom(response$);
    const eventInstance = EventTenantsCreate.fromEvent(response);

    expect(eventInstance.instance.toJSON()).toMatchObject({
      config: {
        label: 'my-new-tenant',
        walletConfig: {
          keyDerivationMethod: 'RAW',
        },
      },
    });
  });

  it(EventTenantsGetAllTenantIds.token, async () => {
    const createResponse$ = client.send<
      EventTenantsCreate,
      EventTenantsCreateInput
    >(EventTenantsCreate.token, {
      label: 'my-new-tenant',
    });

    await firstValueFrom(createResponse$);

    const response$ = client.send<
      EventTenantsGetAllTenantIds,
      EventTenantsGetAllTenantIdsInput
    >(EventTenantsGetAllTenantIds.token, {});

    const response = await firstValueFrom(response$);
    const eventInstance = EventTenantsGetAllTenantIds.fromEvent(response);

    expect(eventInstance.instance.length).toBeGreaterThanOrEqual(1);
  });
});
