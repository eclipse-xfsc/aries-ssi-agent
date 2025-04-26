import type { HealthIndicatorResult } from '@nestjs/terminus';

import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HttpHealthIndicator } from '@nestjs/terminus';

import { NATS } from '../constants.js';
import {
  HealthModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from '../health.module-definition.js';

@Injectable()
export class NATSHealthIndicator extends HealthIndicator {
  public constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly moduleOptions: HealthModuleOptions,
    private readonly http: HttpHealthIndicator,
  ) {
    super();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    if (this.moduleOptions.nats?.monitoringUrl) {
      return this.http.pingCheck(NATS, this.moduleOptions.nats.monitoringUrl);
    }

    return this.getStatus(NATS, true, {
      message: 'NATS server monitoring URL is not provided. Skipping check.',
    });
  }
}
