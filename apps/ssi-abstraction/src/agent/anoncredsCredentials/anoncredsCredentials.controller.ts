import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventAnonCredsCredentialOfferGetAll,
  EventAnonCredsCredentialOfferGetAllInput,
  EventAnonCredsCredentialOfferGetById,
  EventAnonCredsCredentialOfferGetByIdInput,
  EventAnonCredsCredentialRequestGetAll,
  EventAnonCredsCredentialRequestGetAllInput,
  EventAnonCredsCredentialRequestGetById,
  EventAnonCredsCredentialRequestGetByIdInput,
  EventAnonCredsCredentialsDeleteById,
  EventAnonCredsCredentialsDeleteByIdInput,
  EventAnonCredsCredentialsGetAll,
  EventAnonCredsCredentialsGetAllInput,
  EventAnonCredsCredentialsGetById,
  EventAnonCredsCredentialsGetByIdInput,
  EventDidcommAnonCredsCredentialsAcceptOffer,
  EventDidcommAnonCredsCredentialsAcceptOfferInput,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelf,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';

import { AnonCredsCredentialsService } from './anoncredsCredentials.service.js';

@Controller('anoncredsCredentials')
export class AnonCredsCredentialsController {
  public constructor(private credentialsService: AnonCredsCredentialsService) {}

  @MessagePattern(EventAnonCredsCredentialsGetAll.token)
  public async getAll(
    options: EventAnonCredsCredentialsGetAllInput,
  ): Promise<EventAnonCredsCredentialsGetAll> {
    return new EventAnonCredsCredentialsGetAll(
      await this.credentialsService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialOfferGetAll.token)
  public async getAllOffers(
    options: EventAnonCredsCredentialOfferGetAllInput,
  ): Promise<EventAnonCredsCredentialOfferGetAll> {
    return new EventAnonCredsCredentialOfferGetAll(
      await this.credentialsService.getAllOffers(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialRequestGetAll.token)
  public async getAllRequests(
    options: EventAnonCredsCredentialRequestGetAllInput,
  ): Promise<EventAnonCredsCredentialRequestGetAll> {
    return new EventAnonCredsCredentialRequestGetAll(
      await this.credentialsService.getAllRequests(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialsGetById.token)
  public async getById(
    options: EventAnonCredsCredentialsGetByIdInput,
  ): Promise<EventAnonCredsCredentialsGetById> {
    return new EventAnonCredsCredentialsGetById(
      await this.credentialsService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialOfferGetById.token)
  public async getOfferById(
    options: EventAnonCredsCredentialOfferGetByIdInput,
  ): Promise<EventAnonCredsCredentialOfferGetById> {
    return new EventAnonCredsCredentialOfferGetById(
      await this.credentialsService.getOfferById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialRequestGetById.token)
  public async getRequestById(
    options: EventAnonCredsCredentialRequestGetByIdInput,
  ): Promise<EventAnonCredsCredentialRequestGetById> {
    return new EventAnonCredsCredentialRequestGetById(
      await this.credentialsService.getRequestById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsCredentialsDeleteById.token)
  public async deleteById(
    options: EventAnonCredsCredentialsDeleteByIdInput,
  ): Promise<EventAnonCredsCredentialsDeleteById> {
    return new EventAnonCredsCredentialsDeleteById(
      await this.credentialsService.deleteById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsCredentialsAcceptOffer.token)
  public async acceptOffer(
    options: EventDidcommAnonCredsCredentialsAcceptOfferInput,
  ): Promise<EventDidcommAnonCredsCredentialsAcceptOffer> {
    return new EventDidcommAnonCredsCredentialsAcceptOffer(
      await this.credentialsService.acceptOffer(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsCredentialsOffer.token)
  public async offer(
    options: EventDidcommAnonCredsCredentialsOfferInput,
  ): Promise<EventDidcommAnonCredsCredentialsOffer> {
    return new EventDidcommAnonCredsCredentialsOffer(
      await this.credentialsService.offer(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsCredentialsOfferToSelf.token)
  public async offerToSelf(
    options: EventDidcommAnonCredsCredentialsOfferToSelfInput,
  ): Promise<EventDidcommAnonCredsCredentialsOfferToSelf> {
    return new EventDidcommAnonCredsCredentialsOfferToSelf(
      await this.credentialsService.offerToSelf(options),
      options.tenantId,
    );
  }
}
