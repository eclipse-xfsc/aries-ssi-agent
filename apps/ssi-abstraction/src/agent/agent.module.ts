import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AgentService } from './agent.service.js';
import { WithTenantService } from './withTenantService.js';

@Module({
  imports: [ConfigModule],
  providers: [AgentService, WithTenantService],
  exports: [AgentService, WithTenantService],
})
export class AgentModule {}
