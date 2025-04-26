import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventTenantsCreate,
  EventTenantsCreateInput,
  EventTenantsGetAllTenantIds,
} from '@ocm/shared';

import { TenantsService } from './tenants.service.js';

@Controller('tenants')
export class TenantsController {
  public constructor(private tenantsService: TenantsService) {}

  @MessagePattern(EventTenantsCreate.token)
  public async create(
    options: EventTenantsCreateInput,
  ): Promise<EventTenantsCreate> {
    return new EventTenantsCreate(
      await this.tenantsService.create(options),
      undefined,
    );
  }

  @MessagePattern(EventTenantsGetAllTenantIds.token)
  public async getAllTenantIds(): Promise<EventTenantsGetAllTenantIds> {
    return new EventTenantsGetAllTenantIds(
      await this.tenantsService.getAllTenantIds(),
      undefined,
    );
  }
}
