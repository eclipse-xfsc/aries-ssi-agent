import type {
  MiddlewareConsumer,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import {
  EventDidsRegisterEndorserDid,
  HealthModule,
  OpenTelemetryModule,
  loggerMiddleware,
} from '@ocm/shared';
import { firstValueFrom } from 'rxjs';

import { AgentModule } from './agent/agent.module.js';
import { AnonCredsCredentialsModule } from './agent/anoncredsCredentials/anoncredsCredentials.module.js';
import { AnonCredsProofsModule } from './agent/anoncredsProofs/anoncredsProofs.module.js';
import { ConnectionsModule } from './agent/connections/connections.module.js';
import { CredentialDefinitionsModule } from './agent/credentialDefinitions/credentialDefinitions.module.js';
import { DidsModule } from './agent/dids/dids.module.js';
import { RevocationModule } from './agent/revocation/revocation.module.js';
import { SchemasModule } from './agent/schemas/schemas.module.js';
import { TenantsModule } from './agent/tenants/tenants.module.js';
import { NATS_CLIENT } from './common/constants.js';
import { agentConfig } from './config/agent.config.js';
import { httpConfig } from './config/http.config.js';
import { natsConfig } from './config/nats.config.js';
import { s3Config } from './config/s3.config.js';
import { tailsServerConfig } from './config/tails-server.config.js';
import { validationSchema } from './config/validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, natsConfig, tailsServerConfig, s3Config, agentConfig],
      cache: true,
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    ClientsModule.registerAsync({
      clients: [
        {
          name: NATS_CLIENT,
          inject: [natsConfig.KEY],
          useFactory: (config: ConfigType<typeof natsConfig>) => ({
            transport: Transport.NATS,
            options: {
              servers: [config.url],
              user: config.user as string,
              pass: config.password as string,
            },
          }),
        },
      ],
    }),

    HealthModule.registerAsync({
      inject: [natsConfig.KEY],
      useFactory: (config: ConfigType<typeof natsConfig>) => {
        const options: Parameters<typeof HealthModule.register>[0] = {};

        if (config.monitoringUrl) {
          options.nats = {
            monitoringUrl: config.monitoringUrl,
          };
        }

        return options;
      },
    }),

    OpenTelemetryModule,

    AgentModule,
    ConnectionsModule,
    SchemasModule,
    CredentialDefinitionsModule,
    DidsModule,
    SchemasModule,
    AnonCredsCredentialsModule,
    AnonCredsProofsModule,
    TenantsModule,
    RevocationModule,

    RouterModule.register([{ module: HealthModule, path: '/health' }]),
  ],
})
export class Application implements OnApplicationBootstrap, NestModule {
  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public async onApplicationBootstrap() {
    await this.natsClient.connect();

    await firstValueFrom(
      this.natsClient.send(EventDidsRegisterEndorserDid.token, {}),
    );
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
