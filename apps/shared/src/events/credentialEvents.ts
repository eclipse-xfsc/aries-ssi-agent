import type { BaseEventInput } from './baseEvents.js';

import { CredentialExchangeRecord, JsonTransformer } from '@credo-ts/core';

import { BaseEvent } from './baseEvents.js';

export type EventAnonCredsCredentialsGetAllInput = BaseEventInput;
export class EventAnonCredsCredentialsGetAll extends BaseEvent<
  Array<CredentialExchangeRecord>
> {
  public static token = 'anoncreds.credentials.getAll';

  public get instance() {
    return this.data.map((d) =>
      JsonTransformer.fromJSON(d, CredentialExchangeRecord),
    );
  }

  public static fromEvent(e: EventAnonCredsCredentialsGetAll) {
    return new EventAnonCredsCredentialsGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsCredentialsGetByIdInput = BaseEventInput<{
  credentialRecordId: string;
}>;
export class EventAnonCredsCredentialsGetById extends BaseEvent<CredentialExchangeRecord | null> {
  public static token = 'anoncreds.credentials.getById';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, CredentialExchangeRecord)
      : null;
  }

  public static fromEvent(e: EventAnonCredsCredentialsGetById) {
    return new EventAnonCredsCredentialsGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsCredentialsAcceptOfferInput = BaseEventInput<{
  credentialId: string;
}>;
export class EventDidcommAnonCredsCredentialsAcceptOffer extends BaseEvent<CredentialExchangeRecord> {
  public static token = 'didcomm.anoncreds.credentials.acceptOffer';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, CredentialExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsOffer) {
    return new EventDidcommAnonCredsCredentialsOffer(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsCredentialsOfferInput = BaseEventInput<{
  connectionId: string;
  credentialDefinitionId: string;
  attributes: Array<{ name: string; value: string; mimeType?: string }>;
  revocationRegistryDefinitionId?: string;
}>;
export class EventDidcommAnonCredsCredentialsOffer extends BaseEvent<CredentialExchangeRecord> {
  public static token = 'didcomm.anoncreds.credentials.offer';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, CredentialExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsOffer) {
    return new EventDidcommAnonCredsCredentialsOffer(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsCredentialsOfferToSelfInput = Omit<
  EventDidcommAnonCredsCredentialsOfferInput,
  'connectionId'
>;
export class EventDidcommAnonCredsCredentialsOfferToSelf extends BaseEvent<CredentialExchangeRecord> {
  public static token = 'didcomm.anoncreds.credentials.offerToSelf';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, CredentialExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsOfferToSelf) {
    return new EventDidcommAnonCredsCredentialsOfferToSelf(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsCredentialsDeleteByIdInput = BaseEventInput<{
  credentialRecordId: string;
}>;
export class EventAnonCredsCredentialsDeleteById extends BaseEvent {
  public static token = 'anoncreds.credentials.offerToSelf.deleteById';

  public static fromEvent(e: EventAnonCredsCredentialsDeleteById) {
    return new EventAnonCredsCredentialsDeleteById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
