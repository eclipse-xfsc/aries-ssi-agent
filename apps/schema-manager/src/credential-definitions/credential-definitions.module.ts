import { Module } from '@nestjs/common';

import { CredentialDefinitionsController } from './credential-definitions.controller.js';
import { CredentialDefinitionsService } from './credential-definitions.service.js';

@Module({
  providers: [CredentialDefinitionsService],
  controllers: [CredentialDefinitionsController],
})
export class CredentialDefinitionsModule {}
