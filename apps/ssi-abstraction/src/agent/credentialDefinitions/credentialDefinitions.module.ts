import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { CredentialDefinitionsController } from './credentialDefinitions.controller.js';
import { CredentialDefinitionsService } from './credentialDefinitions.service.js';

@Module({
  imports: [AgentModule],
  providers: [CredentialDefinitionsService],
  controllers: [CredentialDefinitionsController],
})
export class CredentialDefinitionsModule {}
