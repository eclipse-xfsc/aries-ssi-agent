import type { BaseEventInput } from './baseEvents.js';
import type {
  AnonCredsPredicateType,
  AnonCredsProofRequestRestriction,
} from '@credo-ts/anoncreds';

import { JsonTransformer, ProofExchangeRecord } from '@credo-ts/core';

import { BaseEvent } from './baseEvents.js';

export type EventAnonCredsProofsGetAllInput = BaseEventInput;
export class EventAnonCredsProofsGetAll extends BaseEvent<
  Array<ProofExchangeRecord>
> {
  public static token = 'anoncreds.proofs.getAll';

  public get instance() {
    return this.data.map((d) =>
      JsonTransformer.fromJSON(d, ProofExchangeRecord),
    );
  }

  public static fromEvent(e: EventAnonCredsProofsGetAll) {
    return new EventAnonCredsProofsGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsProofsGetByIdInput = BaseEventInput<{
  proofRecordId: string;
}>;
export class EventAnonCredsProofsGetById extends BaseEvent<ProofExchangeRecord | null> {
  public static token = 'anoncreds.proofs.getById';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, ProofExchangeRecord)
      : this.data;
  }

  public static fromEvent(e: EventAnonCredsProofsGetById) {
    return new EventAnonCredsProofsGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsProofsRequestInput = BaseEventInput<{
  connectionId: string;
  name: string;
  requestedAttributes: {
    [groupName: string]: {
      names: Array<string>;
      restrictions?: Array<AnonCredsProofRequestRestriction>;
    };
  };
  requestedPredicates: {
    [groupName: string]: {
      name: string;
      predicateType: AnonCredsPredicateType;
      predicateValue: number;
      restrictions?: Array<AnonCredsProofRequestRestriction>;
    };
  };
}>;
export class EventDidcommAnonCredsProofsRequest extends BaseEvent<ProofExchangeRecord> {
  public static token = 'didcomm.anoncreds.proofs.request';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, ProofExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsProofsRequest) {
    return new EventDidcommAnonCredsProofsRequest(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsProofsDeleteByIdInput = BaseEventInput<{
  proofRecordId: string;
}>;
export class EventAnonCredsProofsDeleteById extends BaseEvent {
  public static token = 'anoncreds.proofs.deleteById';

  public static fromEvent(e: EventDidcommAnonCredsProofsRequest) {
    return new EventDidcommAnonCredsProofsRequest(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsProofsAcceptRequestInput = BaseEventInput<{
  proofRecordId: string;
}>;
export class EventDidcommAnonCredsProofsAcceptRequest extends BaseEvent<ProofExchangeRecord> {
  public static token = 'didcomm.anoncreds.proofs.acceptRequest';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, ProofExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsProofsRequest) {
    return new EventDidcommAnonCredsProofsRequest(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
