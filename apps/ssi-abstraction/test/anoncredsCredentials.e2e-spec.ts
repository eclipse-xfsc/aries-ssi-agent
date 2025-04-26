import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventAnonCredsCredentialOfferGetAllInput,
  EventAnonCredsCredentialOfferGetByIdInput,
  EventAnonCredsCredentialRequestGetAllInput,
  EventAnonCredsCredentialRequestGetByIdInput,
  EventAnonCredsCredentialsDeleteByIdInput,
  EventAnonCredsCredentialsGetAllInput,
  EventAnonCredsCredentialsGetByIdInput,
  EventDidcommAnonCredsCredentialsAcceptOfferInput,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';

import {
  AutoAcceptCredential,
  CredentialExchangeRecord,
  CredentialRole,
  CredentialState,
} from '@credo-ts/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventDidcommAnonCredsCredentialsAcceptOffer,
  EventAnonCredsCredentialOfferGetAll,
  EventAnonCredsCredentialOfferGetById,
  EventAnonCredsCredentialRequestGetAll,
  EventAnonCredsCredentialRequestGetById,
  EventAnonCredsCredentialsDeleteById,
  EventAnonCredsCredentialsGetAll,
  EventAnonCredsCredentialsGetById,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommAnonCredsCredentialsOfferToSelf,
} from '@ocm/shared';
import assert from 'assert';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { AnonCredsCredentialsModule } from '../src/agent/anoncredsCredentials/anoncredsCredentials.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { ConnectionsService } from '../src/agent/connections/connections.service.js';
import { CredentialDefinitionsModule } from '../src/agent/credentialDefinitions/credentialDefinitions.module.js';
import { CredentialDefinitionsService } from '../src/agent/credentialDefinitions/credentialDefinitions.service.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { SchemasModule } from '../src/agent/schemas/schemas.module.js';
import { SchemasService } from '../src/agent/schemas/schemas.service.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';
import { natsConfig } from '../src/config/nats.config.js';

describe('Credentials', () => {
  const TOKEN = 'CREDENTIALS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;
  let tenantIdTwo: string;

  let issuerDid: string;
  let credentialDefinitionId: string;
  let connectionId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3004, true),

        AgentModule,
        ConnectionsModule,
        SchemasModule,
        CredentialDefinitionsModule,
        AnonCredsCredentialsModule,
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

    const { id: tIdTwo } = await tenantsService.create({
      label: `${TOKEN}-two`,
    });
    tenantIdTwo = tIdTwo;

    const connectionsService = app.get(ConnectionsService);
    await connectionsService.createConnectionWithSelf({ tenantId });

    const ds = app.get(DidsService);
    await ds.registerEndorserDids();
    const [did] = await ds.registerDidIndyFromSeed({
      tenantId,
      seed: randomBytes(16).toString('hex'),
    });
    issuerDid = did;

    const schemaService = app.get(SchemasService);
    const { schemaId } = await schemaService.register({
      issuerDid,
      tenantId,
      name: 'test-schema-name',
      version: `1.${Date.now()}`,
      attributeNames: ['Name', 'Age'],
    });

    const credentialDefinitionService = app.get(CredentialDefinitionsService);
    const { credentialDefinitionId: cdi } =
      await credentialDefinitionService.register({
        supportsRevocation: false,
        tenantId,
        issuerDid,
        schemaId,
        tag: `default-${Date.now()}`,
      });

    credentialDefinitionId = cdi;

    const connectionService = app.get(ConnectionsService);
    const { invitationUrl } = await connectionService.createInvitation({
      tenantId: tenantIdTwo,
    });

    const connectionRecord = await connectionService.receiveInvitationFromUrl({
      tenantId,
      invitationUrl,
    });

    connectionId = connectionRecord.id;
    await connectionService.waitUntilComplete({ connectionId });
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventAnonCredsCredentialsGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialsGetAll,
      EventAnonCredsCredentialsGetAllInput
    >(EventAnonCredsCredentialsGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsCredentialsGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsCredentialOfferGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialOfferGetAll,
      EventAnonCredsCredentialOfferGetAllInput
    >(EventAnonCredsCredentialOfferGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialOfferGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsCredentialOfferGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialOfferGetById,
      EventAnonCredsCredentialOfferGetByIdInput
    >(EventAnonCredsCredentialOfferGetById.token, {
      tenantId,
      credentialOfferId: 'some-id-that-does-not-exist',
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialOfferGetById.fromEvent(response);

    expect(eventInstance.instance).toBeNull();
  });

  it(EventAnonCredsCredentialRequestGetAll.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialRequestGetAll,
      EventAnonCredsCredentialRequestGetAllInput
    >(EventAnonCredsCredentialRequestGetAll.token, { tenantId });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialRequestGetAll.fromEvent(response);

    expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
  });

  it(EventAnonCredsCredentialRequestGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialRequestGetById,
      EventAnonCredsCredentialRequestGetByIdInput
    >(EventAnonCredsCredentialRequestGetById.token, {
      tenantId,
      credentialRequestId: 'some-id-that-does-not-exist',
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsCredentialRequestGetById.fromEvent(response);

    expect(eventInstance.instance).toBeNull();
  });

  it(EventAnonCredsCredentialsGetById.token, async () => {
    const response$ = client.send<
      EventAnonCredsCredentialsGetById,
      EventAnonCredsCredentialsGetByIdInput
    >(EventAnonCredsCredentialsGetById.token, {
      tenantId,
      credentialRecordId: 'some-id',
    });
    const response = await firstValueFrom(response$);
    const eventInstance = EventAnonCredsCredentialsGetById.fromEvent(response);

    expect(eventInstance.instance).toEqual(null);
  });

  it(EventDidcommAnonCredsCredentialsOffer.token, async () => {
    const attributes = [
      { name: 'Name', value: 'Berend' },
      { name: 'Age', value: '25' },
    ];

    const response$ = client.send<
      EventDidcommAnonCredsCredentialsOffer,
      EventDidcommAnonCredsCredentialsOfferInput
    >(EventDidcommAnonCredsCredentialsOffer.token, {
      tenantId,
      connectionId,
      attributes,
      credentialDefinitionId,
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommAnonCredsCredentialsOffer.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      state: CredentialState.OfferSent,
    });

    const getAllOffersResponse$ = client.send<
      EventAnonCredsCredentialOfferGetAll,
      EventAnonCredsCredentialOfferGetAllInput
    >(EventAnonCredsCredentialOfferGetAll.token, {
      tenantId: tenantIdTwo,
    });

    const getAllOffersResponse = await firstValueFrom(getAllOffersResponse$);
    const getAllOffersEventInstance =
      EventAnonCredsCredentialOfferGetAll.fromEvent(getAllOffersResponse);

    const receivedOffer = getAllOffersEventInstance.instance.find(
      (o) => o.state === CredentialState.OfferReceived,
    );

    expect(receivedOffer).toMatchObject({
      state: CredentialState.OfferReceived,
    });

    assert(receivedOffer);

    const acceptResponse$ = client.send<
      EventDidcommAnonCredsCredentialsAcceptOffer,
      EventDidcommAnonCredsCredentialsAcceptOfferInput
    >(EventDidcommAnonCredsCredentialsAcceptOffer.token, {
      tenantId: tenantIdTwo,
      credentialId: receivedOffer.id,
    });

    const acceptResponse = await firstValueFrom(acceptResponse$);
    const acceptEventInstance =
      EventDidcommAnonCredsCredentialsOffer.fromEvent(acceptResponse);

    expect(acceptEventInstance.instance).toMatchObject({
      state: CredentialState.RequestSent,
    });

    await new Promise((r) => setTimeout(r, 2000));

    const getAllCredentialsResponse$ = client.send<
      EventAnonCredsCredentialsGetAll,
      EventAnonCredsCredentialsGetAllInput
    >(EventAnonCredsCredentialsGetAll.token, {
      tenantId: tenantIdTwo,
    });

    const getAllCredentialsResponse = await firstValueFrom(
      getAllCredentialsResponse$,
    );
    const getAllCredentialsEventInstance =
      EventAnonCredsCredentialsGetAll.fromEvent(getAllCredentialsResponse);

    const credential = getAllCredentialsEventInstance.instance.find(
      (c) => c.id === receivedOffer.id,
    );

    expect(credential).toMatchObject({
      id: receivedOffer.id,
      state: CredentialState.Done,
      role: CredentialRole.Holder,
      credentialAttributes: expect.arrayContaining([
        expect.objectContaining({ name: 'Name', value: 'Berend' }),
        expect.objectContaining({ name: 'Age', value: '25' }),
      ]),
    });
  });

  it(EventDidcommAnonCredsCredentialsOfferToSelf.token, async () => {
    const attributes = [
      { name: 'Name', value: 'Berend' },
      { name: 'Age', value: '25' },
    ];

    const response$ = client.send<
      EventDidcommAnonCredsCredentialsOfferToSelf,
      EventDidcommAnonCredsCredentialsOfferToSelfInput
    >(EventDidcommAnonCredsCredentialsOfferToSelf.token, {
      tenantId,
      credentialDefinitionId,
      attributes,
    });

    const response = await firstValueFrom(response$);
    const eventInstance =
      EventDidcommAnonCredsCredentialsOfferToSelf.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      autoAcceptCredential: AutoAcceptCredential.Always,
      role: CredentialRole.Holder,
      state: CredentialState.Done,
    });

    // Sleep is done here so the last message can be received and we do not end up in a broken state.
    // Without the sleep the broken state is reached because we still have to send to `ack` but we already shut down the agent when the test is finished.
    await new Promise((r) => setTimeout(r, 1000));
  });

  it(EventAnonCredsCredentialsDeleteById.token, async () => {
    let credentialExchangeRecord: CredentialExchangeRecord | undefined =
      undefined;

    // GET ALL
    {
      const response$ = client.send<
        EventAnonCredsCredentialsGetAll,
        EventAnonCredsCredentialsGetAllInput
      >(EventAnonCredsCredentialsGetAll.token, { tenantId });
      const response = await firstValueFrom(response$);
      const eventInstance = EventAnonCredsCredentialsGetAll.fromEvent(response);

      expect(eventInstance.instance).toEqual(expect.arrayContaining([]));
    }

    // Offer a credential

    {
      const attributes = [
        { name: 'Name', value: 'Berend' },
        { name: 'Age', value: '25' },
      ];

      const response$ = client.send<
        EventDidcommAnonCredsCredentialsOfferToSelf,
        EventDidcommAnonCredsCredentialsOfferToSelfInput
      >(EventDidcommAnonCredsCredentialsOfferToSelf.token, {
        tenantId,
        credentialDefinitionId,
        attributes,
      });

      const response = await firstValueFrom(response$);
      const eventInstance =
        EventDidcommAnonCredsCredentialsOfferToSelf.fromEvent(response);

      expect(eventInstance.instance).toMatchObject({
        autoAcceptCredential: AutoAcceptCredential.Always,
      });

      credentialExchangeRecord = eventInstance.instance;
    }

    // GET THE CREDENTIAL BY ID
    {
      const response$ = client.send<
        EventAnonCredsCredentialsGetById,
        EventAnonCredsCredentialsGetByIdInput
      >(EventAnonCredsCredentialsGetById.token, {
        tenantId,
        credentialRecordId: credentialExchangeRecord.id,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsCredentialsGetById.fromEvent(response);

      expect(eventInstance.instance).toBeInstanceOf(CredentialExchangeRecord);
    }

    // DELETE THE CREDENTIAL
    {
      const response$ = client.send<
        EventAnonCredsCredentialsDeleteById,
        EventAnonCredsCredentialsDeleteByIdInput
      >(EventAnonCredsCredentialsDeleteById.token, {
        tenantId,
        credentialRecordId: credentialExchangeRecord.id,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsCredentialsDeleteById.fromEvent(response);

      expect(eventInstance).toMatchObject({});
    }

    // GET THE CREDENTIAL BY ID
    {
      const response$ = client.send<
        EventAnonCredsCredentialsGetById,
        EventAnonCredsCredentialsGetByIdInput
      >(EventAnonCredsCredentialsGetById.token, {
        tenantId,
        credentialRecordId: credentialExchangeRecord.id,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsCredentialsGetById.fromEvent(response);

      expect(eventInstance.instance).toBeNull();
    }
  });
});
