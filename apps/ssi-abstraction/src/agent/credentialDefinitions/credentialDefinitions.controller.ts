import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventAnonCredsCredentialDefinitionsGetAll,
  EventAnonCredsCredentialDefinitionsGetAllInput,
  EventAnonCredsCredentialDefinitionsGetById,
  EventAnonCredsCredentialDefinitionsGetByIdInput,
  EventAnonCredsCredentialDefinitionsRegister,
  EventAnonCredsCredentialDefinitionsRegisterInput,
} from '@ocm/shared';

import { CredentialDefinitionsService } from './credentialDefinitions.service.js';

@Controller('credentialDefinitions')
export class CredentialDefinitionsController {
  public constructor(
    private credentialDefinitionsService: CredentialDefinitionsService,
  ) {}

  @MessagePattern(EventAnonCredsCredentialDefinitionsGetAll.token)
  public async getAll(
    options: EventAnonCredsCredentialDefinitionsGetAllInput,
  ): Promise<EventAnonCredsCredentialDefinitionsGetAll> {
    return new EventAnonCredsCredentialDefinitionsGetAll(
      await this.credentialDefinitionsService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialDefinitionsGetById.token)
  public async getById(
    options: EventAnonCredsCredentialDefinitionsGetByIdInput,
  ): Promise<EventAnonCredsCredentialDefinitionsGetById> {
    return new EventAnonCredsCredentialDefinitionsGetById(
      await this.credentialDefinitionsService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialDefinitionsRegister.token)
  public async register(
    options: EventAnonCredsCredentialDefinitionsRegisterInput,
  ): Promise<EventAnonCredsCredentialDefinitionsRegister> {
    return new EventAnonCredsCredentialDefinitionsRegister(
      await this.credentialDefinitionsService.register(options),
      options.tenantId,
    );
  }
}
