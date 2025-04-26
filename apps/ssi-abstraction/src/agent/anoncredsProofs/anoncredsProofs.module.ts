import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { AnonCredsProofsController } from './anoncredsProofs.controller.js';
import { AnonCredsProofsService } from './anoncredsProofs.service.js';

@Module({
  imports: [AgentModule],
  providers: [AnonCredsProofsService],
  controllers: [AnonCredsProofsController],
})
export class AnonCredsProofsModule {}
