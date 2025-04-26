import { Module } from '@nestjs/common';

import { CredentialOffersController } from './credential-offers.controller.js';
import { CredentialOffersService } from './credential-offers.service.js';

@Module({
  providers: [CredentialOffersService],
  controllers: [CredentialOffersController],
})
export class CredentialOffersModule {}
