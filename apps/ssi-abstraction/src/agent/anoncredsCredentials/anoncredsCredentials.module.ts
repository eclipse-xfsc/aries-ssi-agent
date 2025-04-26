import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { AnonCredsCredentialsController } from './anoncredsCredentials.controller.js';
import { AnonCredsCredentialsService } from './anoncredsCredentials.service.js';

@Module({
  imports: [AgentModule],
  providers: [AnonCredsCredentialsService],
  controllers: [AnonCredsCredentialsController],
})
export class AnonCredsCredentialsModule {}
