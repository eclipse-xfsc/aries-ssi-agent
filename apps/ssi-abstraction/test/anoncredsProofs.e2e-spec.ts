import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventAnonCredsProofsGetAllInput,
  EventAnonCredsProofsGetByIdInput,
  EventDidcommAnonCredsProofsRequestInput,
} from '@ocm/shared';

import { ProofState } from '@credo-ts/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventAnonCredsProofsGetAll,
  EventAnonCredsProofsGetById,
  EventDidcommAnonCredsProofsRequest,
} from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { natsConfig } from '../dist/config/nats.config.js';
import { AgentModule } from '../src/agent/agent.module.js';
import { AnonCredsProofsModule } from '../src/agent/anoncredsProofs/anoncredsProofs.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { ConnectionsService } from '../src/agent/connections/connections.service.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Proofs', () => {
  const TOKEN = 'PROOFS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;

  let connectionId: string;
  let credentialDefinitionId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004, true),

        AgentModule,
        ConnectionsModule,
        AnonCredsProofsModule,
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
    const { id: tId } = await tenantsService.create({ label: TOKEN });
    tenantId = tId;

    const connectionsService = app.get(ConnectionsService);
    const { id } = await connectionsService.createConnectionWithSelf({
      tenantId,
    });
    connectionId = id;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventAnonCredsProofsGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsProofsGetAll,
      EventAnonCredsProofsGetAllInput
    >(EventAnonCredsProofsGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsProofsGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsProofsGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsProofsGetById,
      EventAnonCredsProofsGetByIdInput
    >(EventAnonCredsProofsGetById.token, {
      tenantId,
      proofRecordId: 'some-id',
    });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsProofsGetById.fromEvent(response);

    expect(eventInstance.instance).toEqual(null);
  });

  it(EventDidcommAnonCredsProofsRequest.token, async () => {
    const response$ = client.send<
      EventDidcommAnonCredsProofsRequest,
      EventDidcommAnonCredsProofsRequestInput
    >(EventDidcommAnonCredsProofsRequest.token, {
      tenantId,
      name: 'My Test Proof Request',
      connectionId,
      requestedAttributes: {
        Identity: {
          names: ['Name'],
          restrictions: [{ cred_def_id: credentialDefinitionId }],
        },
      },
      requestedPredicates: {
        'Age > 21': {
          name: 'Age',
          restrictions: [{ cred_def_id: credentialDefinitionId }],
          predicateType: '>',
          predicateValue: 21,
        },
      },
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommAnonCredsProofsRequest.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      state: ProofState.RequestSent,
    });
  });
});
