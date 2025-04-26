import type { BaseEventInput } from './baseEvents.js';

import { CredentialExchangeRecord, JsonTransformer } from '@credo-ts/core';

import { BaseEvent } from './baseEvents.js';

export type EventAnonCredsCredentialOfferGetAllInput = BaseEventInput;

export class EventAnonCredsCredentialOfferGetAll extends BaseEvent<
  Array<CredentialExchangeRecord>
> {
  public static token = 'anoncreds.credentialOffers.getAll';

  public get instance() {
    return this.data.map((d) =>
      JsonTransformer.fromJSON(d, CredentialExchangeRecord),
    );
  }

  public static fromEvent(e: EventAnonCredsCredentialOfferGetAll) {
    return new EventAnonCredsCredentialOfferGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsCredentialOfferGetByIdInput = BaseEventInput & {
  credentialOfferId: string;
};

export class EventAnonCredsCredentialOfferGetById extends BaseEvent<CredentialExchangeRecord | null> {
  public static token = 'anoncreds.credentialOffers.getById';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, CredentialExchangeRecord)
      : null;
  }

  public static fromEvent(e: EventAnonCredsCredentialOfferGetById) {
    return new EventAnonCredsCredentialOfferGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
