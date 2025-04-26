import type { BaseEventInput } from './baseEvents.js';

import { CredentialExchangeRecord, JsonTransformer } from '@credo-ts/core';

import { BaseEvent } from './baseEvents.js';

export type EventAnonCredsCredentialRequestGetAllInput = BaseEventInput;

export class EventAnonCredsCredentialRequestGetAll extends BaseEvent<
  Array<CredentialExchangeRecord>
> {
  public static token = 'anoncreds.credentialRequests.getAll';

  public get instance() {
    return this.data.map((d) =>
      JsonTransformer.fromJSON(d, CredentialExchangeRecord),
    );
  }

  public static fromEvent(e: EventAnonCredsCredentialRequestGetAll) {
    return new EventAnonCredsCredentialRequestGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsCredentialRequestGetByIdInput = BaseEventInput & {
  credentialRequestId: string;
};

export class EventAnonCredsCredentialRequestGetById extends BaseEvent<CredentialExchangeRecord | null> {
  public static token = 'anoncreds.credentialRequests.getById';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, CredentialExchangeRecord)
      : null;
  }

  public static fromEvent(e: EventAnonCredsCredentialRequestGetById) {
    return new EventAnonCredsCredentialRequestGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
