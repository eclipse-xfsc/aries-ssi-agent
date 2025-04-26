import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventDidcommConnectionsBlockInput,
  EventDidcommConnectionsCreateInvitationInput,
  EventDidcommConnectionsCreateWithSelfInput,
  EventDidcommConnectionsGetAllInput,
  EventDidcommConnectionsGetByIdInput,
  EventDidcommConnectionsParseInvitationInput,
  EventDidcommConnectionsReceiveInvitationFromUrlInput,
} from '@ocm/shared';

import {
  ConnectionRecord,
  DidExchangeState,
  OutOfBandInvitation,
} from '@credo-ts/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsCreateInvitation,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsGetById,
  EventDidcommConnectionsParseInvitation,
  EventDidcommConnectionsReceiveInvitationFromUrl,
} from '@ocm/shared';
import assert from 'node:assert';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { MetadataTokens } from '../src/common/constants.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';
import { natsConfig } from '../src/config/nats.config.js';

describe('Connections', () => {
  const TOKEN = 'CONNECTIONS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;
  let tenantIdTwo: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004),

        AgentModule,
        ConnectionsModule,
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

    const ts = app.get(TenantsService);
    const { id } = await ts.create({ label: TOKEN });
    tenantId = id;

    const { id: idTwo } = await ts.create({ label: `${TOKEN}-two` });
    tenantIdTwo = idTwo;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventDidcommConnectionsGetAll.token, async () => {
    const response$ = client.send<
      EventDidcommConnectionsGetAll,
      EventDidcommConnectionsGetAllInput
    >(EventDidcommConnectionsGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance = EventDidcommConnectionsGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventDidcommConnectionsGetById.token, async () => {
    const response$ = client.send<
      EventDidcommConnectionsGetById,
      EventDidcommConnectionsGetByIdInput
    >(EventDidcommConnectionsGetById.token, {
      id: 'some-id',
      tenantId,
    });
    const response = await firstValueFrom(response$);
    const eventInstance = EventDidcommConnectionsGetById.fromEvent(response);

    expect(eventInstance.instance).toBeNull();
  });

  it(EventDidcommConnectionsCreateInvitation.token, async () => {
    const response$ = client.send<
      EventDidcommConnectionsCreateInvitation,
      EventDidcommConnectionsCreateInvitationInput
    >(EventDidcommConnectionsCreateInvitation.token, {
      tenantId,
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommConnectionsCreateInvitation.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      invitationUrl: expect.any(String),
    });
  });

  it(EventDidcommConnectionsReceiveInvitationFromUrl.token, async () => {
    const createInvitationResponse$ = client.send<
      EventDidcommConnectionsCreateInvitation,
      EventDidcommConnectionsCreateInvitationInput
    >(EventDidcommConnectionsCreateInvitation.token, {
      tenantId,
    });
    const createInvitationResponse = await firstValueFrom(
      createInvitationResponse$,
    );
    const createInvitationEventInstance =
      EventDidcommConnectionsCreateInvitation.fromEvent(
        createInvitationResponse,
      );

    const { invitationUrl } = createInvitationEventInstance.instance;

    const response$ = client.send<
      EventDidcommConnectionsReceiveInvitationFromUrl,
      EventDidcommConnectionsReceiveInvitationFromUrlInput
    >(EventDidcommConnectionsReceiveInvitationFromUrl.token, {
      invitationUrl,
      tenantId,
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommConnectionsReceiveInvitationFromUrl.fromEvent(response);

    expect(eventInstance.instance).toBeInstanceOf(ConnectionRecord);
  });

  it(`Create and receive invitation between tenants`, async () => {
    const createInvitationResponse$ = client.send<
      EventDidcommConnectionsCreateInvitation,
      EventDidcommConnectionsCreateInvitationInput
    >(EventDidcommConnectionsCreateInvitation.token, {
      tenantId: tenantIdTwo,
    });
    const createInvitationResponse = await firstValueFrom(
      createInvitationResponse$,
    );
    const {
      instance: { invitationUrl },
    } = EventDidcommConnectionsCreateInvitation.fromEvent(
      createInvitationResponse,
    );

    const response$ = client.send<
      EventDidcommConnectionsReceiveInvitationFromUrl,
      EventDidcommConnectionsReceiveInvitationFromUrlInput
    >(EventDidcommConnectionsReceiveInvitationFromUrl.token, {
      invitationUrl,
      tenantId,
    });
    const response = await firstValueFrom(response$);
    const { instance: connectionRecord } =
      EventDidcommConnectionsReceiveInvitationFromUrl.fromEvent(response);

    await new Promise((r) => setTimeout(r, 2000));

    assert(connectionRecord);

    const getByIdResponse$ = client.send<
      EventDidcommConnectionsGetById,
      EventDidcommConnectionsGetByIdInput
    >(EventDidcommConnectionsGetById.token, {
      tenantId,
      id: connectionRecord.id,
    });
    const getByIdResponse = await firstValueFrom(getByIdResponse$);
    const { instance: maybeRecord } =
      EventDidcommConnectionsGetById.fromEvent(getByIdResponse);

    if (!maybeRecord) {
      throw new Error(`Record not found with id: ${connectionRecord.id}`);
    }

    expect(maybeRecord.state).toStrictEqual(DidExchangeState.Completed);
  });

  it(EventDidcommConnectionsCreateWithSelf.token, async () => {
    const response$ = client.send<
      EventDidcommConnectionsCreateWithSelf,
      EventDidcommConnectionsCreateWithSelfInput
    >(EventDidcommConnectionsCreateWithSelf.token, {
      tenantId,
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommConnectionsCreateWithSelf.fromEvent(response);

    expect(eventInstance.instance).toHaveProperty('id');
    const metadata = eventInstance.instance.metadata.get(
      MetadataTokens.CONNECTION_METADATA_KEY,
    );
    expect(metadata).toMatchObject({ trusted: true });
  });

  it(EventDidcommConnectionsBlock.token, async () => {
    const response$ = client.send<
      EventDidcommConnectionsBlock,
      EventDidcommConnectionsBlockInput
    >(EventDidcommConnectionsBlock.token, {
      idOrDid: 'some-id',
      tenantId,
    });

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidcommConnectionsBlock.fromEvent(response);

    expect(eventInstance.instance).toBeNull();
  });

  it(EventDidcommConnectionsParseInvitation.token, async () => {
    const response$ = client.send<
      EventDidcommConnectionsParseInvitation,
      EventDidcommConnectionsParseInvitationInput
    >(EventDidcommConnectionsParseInvitation.token, {
      invitationUrl:
        'https://didcomm.agent.community.animo.id?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMjJlNmZkMGItZDMyZC00MWE3LTlhOTAtYzY4YzJmMmU2Mzk1IiwgImltYWdlVXJsIjogImh0dHBzOi8vaS5pbWd1ci5jb20vZzNhYmNDTy5wbmciLCAibGFiZWwiOiAiQW5pbW8gQ29tbXVuaXR5IEFnZW50IiwgInJlY2lwaWVudEtleXMiOiBbIjVCTVV3MXJKMW5GUTJLWHhWUFN0dnRGc0ZWYkRkWm5yR1hzaDdFYUVFWjJ3Il0sICJzZXJ2aWNlRW5kcG9pbnQiOiAiaHR0cHM6Ly9kaWRjb21tLmFnZW50LmNvbW11bml0eS5hbmltby5pZCJ9',
      tenantId,
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommConnectionsParseInvitation.fromEvent(response);

    expect(eventInstance.instance).toBeInstanceOf(OutOfBandInvitation);
    expect(eventInstance.instance).toMatchObject({
      id: '22e6fd0b-d32d-41a7-9a90-c68c2f2e6395',
      type: 'https://didcomm.org/out-of-band/1.1/invitation',
      accept: ['didcomm/aip1', 'didcomm/aip2;env=rfc19'],
      handshakeProtocols: ['https://didcomm.org/connections/1.0'],
      imageUrl: 'https://i.imgur.com/g3abcCO.png',
      label: 'Animo Community Agent',
      services: [
        {
          id: '#inline',
          recipientKeys: [
            'did:key:z6MkidcXXG6jMKjs8pNfAxQjmyos54s53T3CxYncwWYF9mpK',
          ],
          serviceEndpoint: 'https://didcomm.agent.community.animo.id',
          type: 'did-communication',
        },
      ],
    });
  });
});
