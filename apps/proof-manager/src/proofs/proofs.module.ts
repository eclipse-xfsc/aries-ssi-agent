import { Module } from '@nestjs/common';

import { ProofsController } from './proofs.controller.js';
import { ProofsService } from './proofs.service.js';

@Module({
  providers: [ProofsService],
  controllers: [ProofsController],
})
export class ProofsModule {}
