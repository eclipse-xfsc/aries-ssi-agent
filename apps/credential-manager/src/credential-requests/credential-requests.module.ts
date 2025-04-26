import { Module } from '@nestjs/common';

import { CredentialRequestsController } from './credential-requests.controller.js';
import { CredentialRequestsService } from './credential-requests.service.js';

@Module({
  providers: [CredentialRequestsService],
  controllers: [CredentialRequestsController],
})
export class CredentialRequestsModule {}
