import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { ClientProxy } from '@nestjs/microservices';
import type {
  EventDidsDidConfigurationInput,
  EventDidsRegisterEndorserDidInput,
  EventDidsRegisterIndyFromSeedInput,
  EventDidsResolveInput,
} from '@ocm/shared';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import {
  EventDidsDidConfiguration,
  EventDidsRegisterEndorserDid,
  EventDidsRegisterIndyFromSeed,
  EventDidsResolve,
} from '@ocm/shared';
import { randomBytes } from 'crypto';
import { firstValueFrom } from 'rxjs';

import { natsConfig } from '../dist/config/nats.config.js';
import { AgentModule } from '../src/agent/agent.module.js';
import { DidsModule } from '../src/agent/dids/dids.module.js';
import { TenantsModule } from '../src/agent/tenants/tenants.module.js';
import { TenantsService } from '../src/agent/tenants/tenants.service.js';
import { mockConfigModule } from '../src/config/__tests__/mockConfig.js';

describe('Dids', () => {
  const TOKEN = 'DIDS_CLIENT_SERVICE';
  let app: INestApplication;
  let client: ClientProxy;
  let tenantId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        mockConfigModule(3005, true),
        AgentModule,
        DidsModule,
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
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });

  it(EventDidsRegisterEndorserDid.token, async () => {
    const response$ = client.send<
      EventDidsRegisterEndorserDid,
      EventDidsRegisterEndorserDidInput
    >(EventDidsRegisterEndorserDid.token, { tenantId });

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidsRegisterEndorserDid.fromEvent(response);

    expect(eventInstance.data).toMatchObject({});
  });

  it(EventDidsRegisterIndyFromSeed.token, async () => {
    const response$ = client.send<
      EventDidsRegisterIndyFromSeed,
      EventDidsRegisterIndyFromSeedInput
    >(EventDidsRegisterIndyFromSeed.token, {
      seed: randomBytes(16).toString('hex'),
      tenantId,
      services: [
        {
          url: 'https://example.org',
          type: 'endpoint',
          identifier: 'endpoint',
        },
      ],
    });

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidsRegisterIndyFromSeed.fromEvent(response);

    expect(
      eventInstance.instance[0].startsWith('did:indy:bcovrin:test:'),
    ).toBeTruthy();
  });

  it(EventDidsDidConfiguration.token, async () => {
    const registerIndyDidResponse$ = client.send<
      EventDidsRegisterIndyFromSeed,
      EventDidsRegisterIndyFromSeedInput
    >(EventDidsRegisterIndyFromSeed.token, {
      seed: randomBytes(16).toString('hex'),
      tenantId,
      services: [
        {
          url: 'https://example.org',
          type: 'endpoint',
          identifier: 'endpoint',
        },
      ],
    });

    await firstValueFrom(registerIndyDidResponse$);

    const response$ = client.send<
      EventDidsDidConfiguration,
      EventDidsDidConfigurationInput
    >(EventDidsDidConfiguration.token, {
      domain: 'https://example.org',
      expiryTime: Date.now() / 1000 + 3600,
      tenantId,
    });

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidsDidConfiguration.fromEvent(response);

    expect(eventInstance.instance).toMatchObject({
      entries: expect.arrayContaining([
        expect.objectContaining({
          did: expect.any(String),
          jwt: expect.any(String),
        }),
      ]),
    });
  });

  it(EventDidsResolve.token, async () => {
    const response$ = client.send<EventDidsResolve, EventDidsResolveInput>(
      EventDidsResolve.token,
      {
        did: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
        tenantId,
      },
    );

    const response = await firstValueFrom(response$);
    const eventInstance = EventDidsResolve.fromEvent(response);

    expect(eventInstance.instance.toJSON()).toStrictEqual({
      '@context': [
        'https://w3id.org/did/v1',
        'https://w3id.org/security/suites/ed25519-2018/v1',
        'https://w3id.org/security/suites/x25519-2019/v1',
      ],
      id: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      verificationMethod: [
        {
          id: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
          type: 'Ed25519VerificationKey2018',
          controller:
            'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
          publicKeyBase58: 'B12NYF8RrR3h41TDCTJojY59usg3mbtbjnFs7Eud1Y6u',
        },
      ],
      authentication: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
      assertionMethod: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
      keyAgreement: [
        {
          id: 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3KCc',
          type: 'X25519KeyAgreementKey2019',
          controller:
            'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
          publicKeyBase58: 'JhNWeSVLMYccCk7iopQW4guaSJTojqpMEELgSLhKwRr',
        },
      ],
      capabilityInvocation: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
      capabilityDelegation: [
        'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH#z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
      ],
    });
  });
});
