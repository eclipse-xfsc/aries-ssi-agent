import type {
  IndyVdrDidCreateOptions,
  IndyVdrDidCreateResult,
} from '@credo-ts/indy-vdr';
import type {
  EventDidsRegisterIndyFromSeedInput,
  DidConfiguration,
  EventDidsDidConfiguration,
  EventDidsDidConfigurationInput,
  EventDidsRegisterIndyFromSeed,
  EventDidsResolve,
  EventDidsResolveInput,
  EventDidsRegisterEndorserDidInput,
  EventDidsRegisterEndorserDid,
} from '@ocm/shared';

import {
  JsonEncoder,
  JwaSignatureAlgorithm,
  JwsService,
  getKeyFromVerificationMethod,
  DidDocumentService,
  Hasher,
  KeyType,
  TypedArrayEncoder,
} from '@credo-ts/core';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LEDGERS } from '../../config/ledger.js';
import { AgentService } from '../agent.service.js';
import { registerPublicDids as registerIndyDids } from '../ledger/register.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class DidsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    private agentService: AgentService,
    private withTenantService: WithTenantService,
    private configService: ConfigService,
  ) {}

  public async resolve({
    did,
    tenantId,
  }: EventDidsResolveInput): Promise<EventDidsResolve['data']> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const {
        didDocument,
        didResolutionMetadata: { message, error },
      } = await t.dids.resolve(did);

      if (!didDocument) {
        throw new Error(
          `Could not resolve did: '${did}'. Error: ${
            error ?? 'None'
          } Message: ${message ?? 'None'}`,
        );
      }

      return didDocument;
    });
  }

  public async getDidConfiguration({
    domain,
    expiryTime,
    tenantId,
  }: EventDidsDidConfigurationInput): Promise<
    EventDidsDidConfiguration['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const indyDids = await t.dids.getCreatedDids({ method: 'indy' });
      const sovDids = await t.dids.getCreatedDids({ method: 'sov' });
      const webDids = await t.dids.getCreatedDids({ method: 'web' });
      const dids = [...indyDids, ...sovDids, ...webDids];

      const jwtEntries: DidConfiguration['entries'] = [];
      const jwsService = t.dependencyManager.resolve(JwsService);

      for (const { did, didDocument } of dids) {
        const payload = {
          iss: did,
          exp: expiryTime,
          domain,
        };

        const encodedPayload = TypedArrayEncoder.fromString(
          JsonEncoder.toString(payload),
        );

        if (
          !didDocument ||
          !didDocument.verificationMethod ||
          !didDocument.verificationMethod[0]
        ) {
          continue;
        }

        const vm = didDocument.verificationMethod[0];

        const key = getKeyFromVerificationMethod(vm);

        const jws = await jwsService.createJwsCompact(t.context, {
          key,
          payload: encodedPayload,
          protectedHeaderOptions: {
            alg: JwaSignatureAlgorithm.EdDSA,
            kid: did,
          },
        });

        jwtEntries.push({ did, jwt: jws });
      }

      return { entries: jwtEntries };
    });
  }

  public async registerEndorserDids(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _?: EventDidsRegisterEndorserDidInput,
  ): Promise<EventDidsRegisterEndorserDid['data']> {
    const ledgerIds = this.configService.get('agent.ledgerIds') as Array<
      keyof typeof LEDGERS
    >;

    const indyDidSeed = this.configService.get('agent.indyDidSeed') as string;
    const indyDid = this.configService.get('agent.indyDid') as string;

    const indyDids = await registerIndyDids({
      ledgerIds,
      seed: indyDidSeed,
      did: indyDid,
    });

    const privKey = {
      privateKey: TypedArrayEncoder.fromString(indyDidSeed),
      keyType: KeyType.Ed25519,
    };

    try {
      this.logger.log('Registering wallet key for endorser dids');
      await this.agentService.agent.wallet.createKey(privKey);
    } catch (e) {
      if (e instanceof Error && e.constructor.name === 'WalletKeyExistsError') {
        this.logger.log('Wallet key already exists');
      } else {
        throw e;
      }
    }

    for (const indyDid of indyDids) {
      await this.agentService.agent.dids.import({
        did: indyDid.did,
        privateKeys: [privKey],
        overwrite: true,
      });
    }

    return {};
  }

  public async registerDidIndyFromSeed({
    tenantId,
    seed,
    services,
  }: EventDidsRegisterIndyFromSeedInput): Promise<
    EventDidsRegisterIndyFromSeed['data']
  > {
    const dids: Array<string> = [];

    const { publicKey, publicKeyBase58 } = await this.withTenantService.invoke(
      tenantId,
      async (t) =>
        t.wallet.createKey({
          privateKey: TypedArrayEncoder.fromString(seed),
          keyType: KeyType.Ed25519,
        }),
    );

    const buffer = Hasher.hash(publicKey, 'sha-256');
    const id = TypedArrayEncoder.toBase58(buffer.slice(0, 16));
    const verkey = publicKeyBase58;

    const ledgerIds = this.configService.get('agent.ledgerIds') as Array<
      keyof typeof LEDGERS
    >;

    for (const ledgerId of ledgerIds) {
      const ledger = LEDGERS[ledgerId as keyof typeof LEDGERS];

      const endorserDids = await this.agentService.agent.dids.getCreatedDids({
        method: 'indy',
      });

      const endorserDid = endorserDids
        .map(({ did }) => did)
        .find((did) => did.includes(ledger.namespace));

      if (!endorserDid) {
        throw new Error(
          `Endorser did could not be found for ${ledger.namespace}`,
        );
      }

      const did = `did:indy:${ledger.namespace}:${id}`;
      const didDocumentServices: Array<DidDocumentService> | undefined =
        services?.map(
          (s) =>
            new DidDocumentService({
              id: `${did}#${s.identifier}`,
              type: s.type,
              serviceEndpoint: s.url,
            }),
        );

      await this.withTenantService.invoke(tenantId, async (t) => {
        const { didState } = (await t.dids.create<IndyVdrDidCreateOptions>({
          did,
          options: {
            verkey,
            endorserMode: 'external',
            endorserDid,
            services: didDocumentServices,
            useEndpointAttrib: true,
          },
        })) as IndyVdrDidCreateResult;

        if (
          didState.state !== 'action' ||
          didState.action !== 'endorseIndyTransaction'
        ) {
          throw Error(
            `An error occurred while trying to register the did: '${did}'. Result: ${JSON.stringify(didState)}`,
          );
        }

        const signedNymRequest = await this.agentService.endorseTransaction(
          didState.nymRequest,
          didState.endorserDid,
        );

        const didCreateSubmitResult =
          await t.dids.create<IndyVdrDidCreateOptions>({
            did: didState.did,
            options: {
              endorserMode: 'external',
              endorsedTransaction: {
                nymRequest: signedNymRequest,
              },
            },
            secret: didState.secret,
          });

        if (didCreateSubmitResult.didState.state !== 'finished') {
          throw new Error(
            didCreateSubmitResult.didState.state === 'failed'
              ? `Did registration for network ${ledger.namespace} failed due to '${didCreateSubmitResult.didState.reason}'`
              : `Did registration for network ${ledger.namespace} failed with state '${didCreateSubmitResult.didState.state}' due to an unknown reason`,
          );
        }

        await t.dids.import({
          did: didState.did,
          didDocument: didState.didDocument,
          overwrite: true,
          privateKeys: [
            {
              keyType: KeyType.Ed25519,
              privateKey: TypedArrayEncoder.fromString(seed),
            },
          ],
        });

        dids.push(didState.did);
      });
    }

    return dids;
  }
}
