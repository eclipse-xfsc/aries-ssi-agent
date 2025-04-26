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
  HealthModule,
  OpenTelemetryModule,
  loggerMiddleware,
} from '@ocm/shared';

import { NATS_CLIENT } from './common/constants.js';
import { httpConfig } from './config/http.config.js';
import { natsConfig } from './config/nats.config.js';
import { validationSchema } from './config/validation.js';
import { ConnectionsModule } from './connections/connections.module.js';
import { InvitationsModule } from './invitations/invitations.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, natsConfig],
      cache: true,
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: NATS_CLIENT,
          inject: [natsConfig.KEY],
          useFactory: (config: ConfigType<typeof natsConfig>) => ({
            transport: Transport.NATS,
            options: {
              servers: [config.url],
              user: config.user,
              pass: config.password,
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
            monitoringUrl: config.monitoringUrl as string,
          };
        }

        return options;
      },
    }),

    OpenTelemetryModule,

    ConnectionsModule,
    InvitationsModule,

    RouterModule.register([
      { module: HealthModule, path: '/health' },
      { module: ConnectionsModule, path: '/connections' },
      { module: InvitationsModule, path: '/invitations' },
    ]),
  ],
})
export class Application implements OnApplicationBootstrap, NestModule {
  public constructor(
    @Inject(NATS_CLIENT) private readonly client: ClientProxy,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.client.connect();
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
