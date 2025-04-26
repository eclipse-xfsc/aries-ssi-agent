import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { RevocationController } from './revocation.controller.js';
import { RevocationService } from './revocation.service.js';

@Module({
  imports: [AgentModule],
  providers: [RevocationService],
  controllers: [RevocationController],
})
export class RevocationModule {}
