import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';

@Module({
  imports: [AgentModule],
  providers: [TenantsService],
  controllers: [TenantsController],
})
export class TenantsModule {}
