import type { AppAgent } from '../agent.service.js';
import type {
  EventTenantsCreate,
  EventTenantsCreateInput,
  EventTenantsGetAllTenantIds,
} from '@ocm/shared';

import { TenantRepository } from '@credo-ts/tenants/build/repository/TenantRepository.js';
import { Injectable } from '@nestjs/common';

import { AgentService } from '../agent.service.js';

@Injectable()
export class TenantsService {
  private agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public async create({
    label,
  }: EventTenantsCreateInput): Promise<EventTenantsCreate['data']> {
    return await this.agent.modules.tenants.createTenant({ config: { label } });
  }

  public async getAllTenantIds(): Promise<EventTenantsGetAllTenantIds['data']> {
    const tenantRepository =
      this.agent.dependencyManager.resolve(TenantRepository);

    const tenantRecords = await tenantRepository.getAll(this.agent.context);

    return tenantRecords.map((t) => t.id);
  }
}
