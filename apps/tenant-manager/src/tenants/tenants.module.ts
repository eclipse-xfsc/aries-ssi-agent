import { Module } from '@nestjs/common';

import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';

@Module({
  providers: [TenantsService],
  controllers: [TenantsController],
})
export class TenantsModule {}
