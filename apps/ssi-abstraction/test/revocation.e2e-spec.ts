import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventAnonCredsRevocationCheckCredentialStatusInput,
  EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput,
  EventAnonCredsRevocationRegisterRevocationStatusListInput,
  EventAnonCredsRevocationRevokeInput,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommConnectionsCreateInvitationInput,
  EventDidcommConnectionsGetByIdInput,
  EventDidcommConnectionsReceiveInvitationFromUrlInput,
} from '@ocm/shared';

import { DidExchangeState } from '@credo-ts/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventDidcommConnectionsGetById,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommConnectionsReceiveInvitationFromUrl,
  EventDidcommConnectionsCreateInvitation,
  EventAnonCredsRevocationCheckCredentialStatus,
  EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
  EventAnonCredsRevocationRegisterRevocationStatusList,
  EventAnonCredsRevocationRevoke,
  RevocationState,
} from '@ocm/shared';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from '../src/agent/agent.module.js';
import { AnonCredsCredentialsModule } from '../src/agent/anoncredsCredentials/anoncredsCredentials.module.js';
import { ConnectionsModule } from '../src/agent/connections/connections.module.js';
import { CredentialDefinitionsModule } from '../src/agent/credentialDefinitions/credentialDefinitions.module.js';
import { CredentialDefinitionsService } from '../src/agent/credentialDefinitions/credentialDefinitions.service.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { DidsService } from '../src/agent/dids/dids.service.js';
import { RevocationModule } from '../src/agent/revocation/revocation.module.js';
import { SchemasModule } from '../src/agent/schemas/schemas.module.js';
import { SchemasService } from '../src/agent/schemas/schemas.service.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';
import { natsConfig } from '../src/config/nats.config.js';

describe('Revocation', () => {
  const TOKEN = 'REVOCATION_CLIENT_SERVICE';
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
        RevocationModule,

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

    const { id: idTwo } = await tenantsService.create({
      label: `${TOKEN}-two`,
    });
    tenantIdTwo = idTwo;

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
        supportsRevocation: true,
        tenantId,
        issuerDid,
        schemaId,
        tag: `default-${Date.now()}`,
      });

    credentialDefinitionId = cdi;
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(
    EventAnonCredsRevocationRegisterRevocationRegistryDefinition.token,
    async () => {
      const response$ = client.send<
        EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
        EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput
      >(EventAnonCredsRevocationRegisterRevocationRegistryDefinition.token, {
        tenantId,
        tag: 'rev-tag',
        issuerDid,
        credentialDefinitionId,
        maximumCredentialNumber: 100,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsRevocationRegisterRevocationRegistryDefinition.fromEvent(
          response,
        );

      expect(
        eventInstance.instance.revocationRegistryDefinitionId.startsWith(
          'did:indy:bcovrin:test:',
        ),
      ).toBeTruthy();
    },
  );

  it(EventAnonCredsRevocationRegisterRevocationStatusList.token, async () => {
    let revRegDefId: string = '';
    {
      const response$ = client.send<
        EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
        EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput
      >(EventAnonCredsRevocationRegisterRevocationRegistryDefinition.token, {
        tenantId,
        tag: 'rev-tag-two',
        issuerDid,
        credentialDefinitionId,
        maximumCredentialNumber: 100,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsRevocationRegisterRevocationRegistryDefinition.fromEvent(
          response,
        );

      revRegDefId = eventInstance.instance.revocationRegistryDefinitionId;
    }

    const response$ = client.send<
      EventAnonCredsRevocationRegisterRevocationStatusList,
      EventAnonCredsRevocationRegisterRevocationStatusListInput
    >(EventAnonCredsRevocationRegisterRevocationStatusList.token, {
      tenantId,
      revocationRegistryDefinitionId: revRegDefId,
      issuerDid,
    });
    const response = await firstValueFrom(response$);
    const eventInstance =
      EventAnonCredsRevocationRegisterRevocationStatusList.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({});
  });

  it(EventAnonCredsRevocationRevoke.token, async () => {
    let revRegDefId: string = '';
    let credentialId: string = '';

    // Register the revocation registry definition
    {
      const response$ = client.send<
        EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
        EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput
      >(EventAnonCredsRevocationRegisterRevocationRegistryDefinition.token, {
        tenantId,
        tag: 'rev-tag-three',
        issuerDid,
        credentialDefinitionId,
        maximumCredentialNumber: 100,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsRevocationRegisterRevocationRegistryDefinition.fromEvent(
          response,
        );

      revRegDefId = eventInstance.instance.revocationRegistryDefinitionId;
    }

    // Register the revocation Status List
    {
      const response$ = client.send<
        EventAnonCredsRevocationRegisterRevocationStatusList,
        EventAnonCredsRevocationRegisterRevocationStatusListInput
      >(EventAnonCredsRevocationRegisterRevocationStatusList.token, {
        tenantId,
        revocationRegistryDefinitionId: revRegDefId,
        issuerDid,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsRevocationRegisterRevocationStatusList.fromEvent(
          response,
        );

      expect(eventInstance.instance).toMatchObject({});
    }

    // Establish a connection with another tenant
    {
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

      // Wait for the connection to be established
      await new Promise((r) => setTimeout(r, 2000));

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

      connectionId = connectionRecord.id;
    }

    // Issue a credential
    {
      const response$ = client.send<
        EventDidcommAnonCredsCredentialsOffer,
        EventDidcommAnonCredsCredentialsOfferInput
      >(EventDidcommAnonCredsCredentialsOffer.token, {
        tenantId,
        connectionId,
        attributes: [
          { name: 'Name', value: 'Berend' },
          { name: 'Age', value: '30' },
        ],
        revocationRegistryDefinitionId: revRegDefId,
        credentialDefinitionId,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventDidcommAnonCredsCredentialsOffer.fromEvent(response);

      credentialId = eventInstance.instance.id;
    }

    // Revoke the credential
    {
      const response$ = client.send<
        EventAnonCredsRevocationRevoke,
        EventAnonCredsRevocationRevokeInput
      >(EventAnonCredsRevocationRevoke.token, {
        tenantId,
        credentialId,
      });
      const response = await firstValueFrom(response$);
      const eventInstance = EventAnonCredsRevocationRevoke.fromEvent(response);
      expect(eventInstance.instance).toBeNull();
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Check the revocation state
    {
      const response$ = client.send<
        EventAnonCredsRevocationCheckCredentialStatus,
        EventAnonCredsRevocationCheckCredentialStatusInput
      >(EventAnonCredsRevocationCheckCredentialStatus.token, {
        tenantId,
        credentialId,
      });
      const response = await firstValueFrom(response$);
      const eventInstance =
        EventAnonCredsRevocationCheckCredentialStatus.fromEvent(response);
      expect(eventInstance.instance.state).toBe(RevocationState.Revoked);
    }
  });
});
