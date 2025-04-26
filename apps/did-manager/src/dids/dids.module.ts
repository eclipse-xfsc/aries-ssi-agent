import { Module } from '@nestjs/common';

import { DIDsController } from './dids.controller.js';
import { DIDsService } from './dids.service.js';

@Module({
  providers: [DIDsService],
  controllers: [DIDsController],
})
export class DIDsModule {}
