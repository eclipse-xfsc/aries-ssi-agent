import type { LedgerIds } from '../config/ledger.js';
import type { InitConfig, WalletConfig } from '@credo-ts/core';
import type { IndyVdrPoolConfig } from '@credo-ts/indy-vdr';
import type { OnApplicationShutdown } from '@nestjs/common';

import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  AnonCredsProofFormatService,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
} from '@credo-ts/anoncreds';
import { AskarModule } from '@credo-ts/askar';
import {
  Agent,
  CacheModule,
  ConnectionsModule,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  InMemoryLruCache,
  JwkDidRegistrar,
  JwkDidResolver,
  KeyDidRegistrar,
  KeyDidResolver,
  LogLevel,
  PeerDidRegistrar,
  PeerDidResolver,
  ProofsModule,
  V2CredentialProtocol,
  V2ProofProtocol,
  WebDidResolver,
  WsOutboundTransport,
} from '@credo-ts/core';
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
  IndyVdrSovDidResolver,
} from '@credo-ts/indy-vdr';
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node';
import { TenantsModule } from '@credo-ts/tenants';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from '@ocm/shared';

import { parseDid } from '../common/utils.js';
import { LEDGERS } from '../config/ledger.js';

import { AgentLogger } from './logger.js';
import { S3TailsFileService } from './revocation/TailsFileService.js';

export type TenantAgent = Agent<Omit<AgentService['modules'], 'tenants'>>;
export type AppAgent = Agent<AgentService['modules']>;

@Injectable()
export class AgentService implements OnApplicationShutdown {
  public agent: AppAgent;

  private configService: ConfigService;

  public constructor(configService: ConfigService) {
    this.configService = configService;

    const inboundPort = this.configService.get('agent.inboundPort');
    this.agent = new Agent({
      config: this.config,
      modules: this.modules,
      dependencies: agentDependencies,
    });

    const httpInbound = new HttpInboundTransport({
      port: inboundPort,
    });

    this.agent.registerInboundTransport(httpInbound);
    this.agent.registerOutboundTransport(new WsOutboundTransport());
    this.agent.registerOutboundTransport(new HttpOutboundTransport());
  }

  public get config(): InitConfig {
    const {
      name,
      walletId,
      walletKey,
      host,
      inboundPort,
      path,
      walletStorageType,
      walletStorageConfig,
      walletStorageCredentials,
    } = this.configService.get('agent');

    const endpoints = [`${host}:${inboundPort}${path}`];

    let walletStorage: WalletConfig['storage'];

    if (walletStorageType && walletStorageType === 'postgres') {
      walletStorage = {
        type: walletStorageType,
        config: {
          host: walletStorageConfig.host,
          connectionTimeout: walletStorageConfig.timeout,
        },
      };

      if (walletStorageCredentials) {
        walletStorage.credentials = {
          account: walletStorageCredentials.account,
          password: walletStorageCredentials.password,
          adminAccount: walletStorageCredentials.adminAccount,
          adminPassword: walletStorageCredentials.adminPassword,
        };
      }
    }

    return {
      label: name,
      walletConfig: {
        id: walletId,
        key: walletKey,
        storage: walletStorage,
      },
      endpoints,
      logger: new AgentLogger(LogLevel.debug),
      autoUpdateStorageOnStartup: true,
    };
  }

  public get modules() {
    const { autoAcceptConnection, autoAcceptCredential, autoAcceptProof } =
      this.configService.get('agent');

    const tailsServerBaseUrl = this.configService.getOrThrow(
      'tailsServer.baseUrl',
    );
    const tailsServerBucketName = this.configService.getOrThrow(
      'tailsServer.bucketName',
    );
    const s3Secret = this.configService.getOrThrow('s3.secret');
    const s3AccessKey = this.configService.getOrThrow('s3.accessKey');

    return {
      connections: new ConnectionsModule({
        autoAcceptConnections: autoAcceptConnection,
      }),

      credentials: new CredentialsModule({
        autoAcceptCredentials: autoAcceptCredential,
        credentialProtocols: [
          new V2CredentialProtocol({
            credentialFormats: [
              new AnonCredsCredentialFormatService(),
              new LegacyIndyCredentialFormatService(),
            ],
          }),
        ],
      }),

      proofs: new ProofsModule({
        autoAcceptProofs: autoAcceptProof,
        proofProtocols: [
          new V2ProofProtocol({
            proofFormats: [
              new AnonCredsProofFormatService(),
              new LegacyIndyProofFormatService(),
            ],
          }),
        ],
      }),

      cache: new CacheModule({ cache: new InMemoryLruCache({ limit: 500 }) }),

      anoncreds: new AnonCredsModule({
        anoncreds,
        registries: [new IndyVdrAnonCredsRegistry()],
        tailsFileService: new S3TailsFileService({
          tailsServerBaseUrl,
          s3AccessKey,
          s3Secret,
          tailsServerBucketName,
        }),
      }),
      indyVdr: new IndyVdrModule({ indyVdr, networks: this.ledgers }),

      dids: new DidsModule({
        resolvers: [
          new IndyVdrIndyDidResolver(),
          new IndyVdrSovDidResolver(),
          new PeerDidResolver(),
          new KeyDidResolver(),
          new JwkDidResolver(),
          new WebDidResolver(),
        ],
        registrars: [
          new PeerDidRegistrar(),
          new KeyDidRegistrar(),
          new JwkDidRegistrar(),
          new IndyVdrIndyDidRegistrar(),
        ],
      }),

      askar: new AskarModule({ ariesAskar }),

      tenants: new TenantsModule(),
    };
  }

  private get ledgers() {
    const ledgerIds = this.configService.get('agent.ledgerIds');

    if (!ledgerIds || ledgerIds.length < 1 || ledgerIds[0] === '') {
      return [];
    }

    return ledgerIds.map((id: LedgerIds) => {
      const ledgerId: LedgerIds = id;

      if (!LEDGERS[ledgerId]) {
        throw new Error(
          `No pool transaction genesis provided for ledger ${ledgerId}`,
        );
      }

      const ledger: IndyVdrPoolConfig = {
        indyNamespace: LEDGERS[ledgerId].namespace,
        genesisTransactions: LEDGERS[ledgerId].genesisTransaction,
        isProduction: false,
      };

      return ledger;
    });
  }

  public async getEndorserDid(issuerDid: string) {
    const { method, namespaceAndNetwork } = parseDid(issuerDid);
    const dids = await this.agent.dids.getCreatedDids({ method });

    const did = dids
      .map(({ did }) => did)
      .find((did) => did.includes(namespaceAndNetwork));

    if (!did) {
      throw new Error(
        `Could not find endorser did for method: '${method}' on network: '${namespaceAndNetwork}'`,
      );
    }

    return did;
  }

  public async endorseTransaction(txn: string, endorserDid: string) {
    return this.agent.modules.indyVdr.endorseTransaction(txn, endorserDid);
  }

  public async onModuleInit() {
    await this.agent.initialize();
    logger.info('Agent initialized');
  }

  public async onApplicationShutdown() {
    if (!this.agent.isInitialized) return;

    // If we cannot shutdown the wallet on application shutdown, no error will occur
    // This is done because the Askar shutdown procedure is a bit buggy
    try {
      await this.agent.shutdown();
    } catch (e) {
      logger.warn(`Agent shutdown issue occurred. Cause: ${e}`);
    }
  }
}
