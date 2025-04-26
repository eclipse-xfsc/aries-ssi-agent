import type {
  EventAnonCredsCredentialOfferGetAllInput,
  EventAnonCredsCredentialOfferGetByIdInput,
  EventDidcommAnonCredsCredentialsAcceptOfferInput,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';
import type { Observable } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventDidcommAnonCredsCredentialsAcceptOffer,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommAnonCredsCredentialsOfferToSelf,
  EventAnonCredsCredentialOfferGetAll,
  EventAnonCredsCredentialOfferGetById,
} from '@ocm/shared';
import { map } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class CredentialOffersService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public findCredentialOffers(tenantId: string) {
    this.logger.log({
      message: 'Find all credential offers',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialOfferGetAll,
        EventAnonCredsCredentialOfferGetAllInput
      >(EventAnonCredsCredentialOfferGetAll.token, { tenantId })
      .pipe(map(({ data }) => data));
  }

  public getCredentialOfferById(tenantId: string, credentialOfferId: string) {
    this.logger.log({
      message: 'Get a credential offer by ID',
      labels: { tenantId },
      'ocm.credentialOffers.credentialOfferId': credentialOfferId,
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialOfferGetById,
        EventAnonCredsCredentialOfferGetByIdInput
      >(EventAnonCredsCredentialOfferGetById.token, {
        tenantId,
        credentialOfferId,
      })
      .pipe(map(({ data }) => data));
  }

  public offer(
    tenantId: string,
    connectionId: string,
    credentialDefinitionId: string,
    attributes: EventDidcommAnonCredsCredentialsOfferInput['attributes'],
    revocationRegistryDefinitionId?: string,
  ): Observable<EventDidcommAnonCredsCredentialsOffer['data']> {
    this.logger.log({
      message: 'Offer a credential',
      labels: { tenantId },
      'ocm.credentialOffers': {
        connectionId,
        credentialDefinitionId,
        attributes,
        revocationRegistryDefinitionId,
      },
    });
    return this.natsClient
      .send<
        EventDidcommAnonCredsCredentialsOffer,
        EventDidcommAnonCredsCredentialsOfferInput
      >(EventDidcommAnonCredsCredentialsOffer.token, {
        tenantId,
        connectionId,
        credentialDefinitionId,
        attributes,
        revocationRegistryDefinitionId,
      })
      .pipe(map(({ data }) => data));
  }

  public offerToSelf(
    tenantId: string,
    credentialDefinitionId: string,
    attributes: EventDidcommAnonCredsCredentialsOfferToSelfInput['attributes'],
  ): Observable<EventDidcommAnonCredsCredentialsOfferToSelf['data']> {
    this.logger.log({
      message: 'Offer a credential to self',
      labels: { tenantId },
      'ocm.credentialOffers': { credentialDefinitionId, attributes },
    });
    return this.natsClient
      .send<
        EventDidcommAnonCredsCredentialsOfferToSelf,
        EventDidcommAnonCredsCredentialsOfferToSelfInput
      >(EventDidcommAnonCredsCredentialsOfferToSelf.token, {
        tenantId,
        credentialDefinitionId,
        attributes,
      })
      .pipe(map(({ data }) => data));
  }

  public acceptOffer(tenantId: string, credentialId: string) {
    this.logger.log({
      message: 'Accept a credential offer',
      labels: { tenantId },
      'ocm.credentialOffers.credentialId': credentialId,
    });
    return this.natsClient
      .send<
        EventDidcommAnonCredsCredentialsAcceptOffer,
        EventDidcommAnonCredsCredentialsAcceptOfferInput
      >(EventDidcommAnonCredsCredentialsAcceptOffer.token, {
        tenantId,
        credentialId,
      })
      .pipe(map(({ data }) => data));
  }
}
