import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { NATSHealthIndicator } from './indicators/nats.health.js';

@Controller({ version: VERSION_NEUTRAL })
@ApiExcludeController()
export class HealthController {
  public constructor(
    private readonly natsHealthIndicator: NATSHealthIndicator,
    private readonly health: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this.health.check([() => this.natsHealthIndicator.isHealthy()]);
  }
}
