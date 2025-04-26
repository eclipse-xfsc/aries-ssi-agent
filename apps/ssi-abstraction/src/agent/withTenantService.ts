import type { AppAgent, TenantAgent } from './agent.service.js';

import { Injectable } from '@nestjs/common';

import { AgentService } from './agent.service.js';

@Injectable()
export class WithTenantService {
  private agent: AppAgent;

  public constructor(agentService: AgentService) {
    this.agent = agentService.agent;
  }

  public async invoke<T>(
    tenantId: string,
    cb: (tenant: TenantAgent) => Promise<T>,
  ): Promise<T> {
    try {
      const tenant = await this.agent.modules.tenants.getTenantAgent({
        tenantId,
      });

      return cb(tenant as unknown as TenantAgent);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
