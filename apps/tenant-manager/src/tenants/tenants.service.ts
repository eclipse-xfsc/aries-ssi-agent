import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventTenantsCreate,
  EventTenantsGetAllTenantIds,
  handleSSIResponse,
} from '@ocm/shared';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public find() {
    this.logger.log({
      message: 'Find all tenants',
    });
    return this.natsClient
      .send(EventTenantsGetAllTenantIds.token, {})
      .pipe(handleSSIResponse);
  }

  public create(label: string) {
    this.logger.log({
      message: 'Create a tenant',
      'ocm.tenants.label': label,
    });
    return this.natsClient
      .send(EventTenantsCreate.token, { label })
      .pipe(handleSSIResponse);
  }
}
