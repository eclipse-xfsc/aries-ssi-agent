import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller.js';
import { ConfigurableModuleClass } from './health.module-definition.js';
import { NATSHealthIndicator } from './indicators/nats.health.js';

@Module({
  imports: [HttpModule, TerminusModule],
  controllers: [HealthController],
  providers: [NATSHealthIndicator],
})
export class HealthModule extends ConfigurableModuleClass {}
