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
import { TenantsModule } from './tenants/tenants.module.js';

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
            monitoringUrl: config.monitoringUrl as string,
          };
        }

        return options;
      },
    }),

    OpenTelemetryModule,

    TenantsModule,

    RouterModule.register([
      { module: HealthModule, path: '/health' },
      { module: TenantsModule, path: '/tenants' },
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
