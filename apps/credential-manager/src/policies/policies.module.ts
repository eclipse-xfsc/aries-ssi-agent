import type { ConfigType } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { TSAModule } from '@ocm/shared';

import { policiesConfig } from '../config/policies.config.js';

import { PoliciesController } from './policies.controller.js';
import { PoliciesService } from './policies.service.js';

@Module({
  imports: [
    TSAModule.registerAsync({
      inject: [policiesConfig.KEY],
      useFactory: (config: ConfigType<typeof policiesConfig>) => ({
        tsaBaseUrl: config.url as string,
      }),
    }),
  ],
  providers: [PoliciesService],
  controllers: [PoliciesController],
})
export class PoliciesModule {}
