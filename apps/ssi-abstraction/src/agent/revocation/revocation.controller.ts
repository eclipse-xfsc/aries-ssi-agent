import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventAnonCredsRevocationCheckCredentialStatus,
  EventAnonCredsRevocationCheckCredentialStatusInput,
  EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
  EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput,
  EventAnonCredsRevocationRegisterRevocationStatusList,
  EventAnonCredsRevocationRegisterRevocationStatusListInput,
  EventAnonCredsRevocationRevoke,
  EventAnonCredsRevocationRevokeInput,
  EventAnonCredsRevocationTailsFile,
  EventAnonCredsRevocationTailsFileInput,
} from '@ocm/shared';

import { RevocationService } from './revocation.service.js';

@Controller('revocation')
export class RevocationController {
  public constructor(private revocationService: RevocationService) {}

  @MessagePattern(EventAnonCredsRevocationRevoke.token)
  public async revoke(
    options: EventAnonCredsRevocationRevokeInput,
  ): Promise<EventAnonCredsRevocationRevoke> {
    return new EventAnonCredsRevocationRevoke(
      await this.revocationService.revoke(options),
      options.tenantId,
    );
  }

  @MessagePattern(
    EventAnonCredsRevocationRegisterRevocationRegistryDefinition.token,
  )
  public async registerRevocationRegistryDefinition(
    options: EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput,
  ): Promise<EventAnonCredsRevocationRegisterRevocationRegistryDefinition> {
    return new EventAnonCredsRevocationRegisterRevocationRegistryDefinition(
      await this.revocationService.registerRevocationRegistryDefinition(
        options,
      ),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsRevocationRegisterRevocationStatusList.token)
  public async registerRevocationStatusList(
    options: EventAnonCredsRevocationRegisterRevocationStatusListInput,
  ): Promise<EventAnonCredsRevocationRegisterRevocationStatusList> {
    return new EventAnonCredsRevocationRegisterRevocationStatusList(
      await this.revocationService.registerRevocationStatusList(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsRevocationTailsFile.token)
  public async getTailsFile(
    options: EventAnonCredsRevocationTailsFileInput,
  ): Promise<EventAnonCredsRevocationTailsFile> {
    return new EventAnonCredsRevocationTailsFile(
      await this.revocationService.getTailsFile(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsRevocationCheckCredentialStatus.token)
  public async checkCredentialStatus(
    options: EventAnonCredsRevocationCheckCredentialStatusInput,
  ): Promise<EventAnonCredsRevocationCheckCredentialStatus> {
    return new EventAnonCredsRevocationCheckCredentialStatus(
      await this.revocationService.checkCredentialStatus(options),
      options.tenantId,
    );
  }
}
