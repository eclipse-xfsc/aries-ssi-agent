import { Module } from '@nestjs/common';

import { CredentialsController } from './credentials.controller.js';
import { CredentialsService } from './credentials.service.js';

@Module({
  providers: [CredentialsService],
  controllers: [CredentialsController],
})
export class CredentialsModule {}
