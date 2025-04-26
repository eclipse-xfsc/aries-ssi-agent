import type { BaseEventInput } from './baseEvents.js';

import { DidDocument, JsonTransformer } from '@credo-ts/core';

import { BaseEvent } from './baseEvents.js';

export type EventDidsResolveInput = BaseEventInput<{ did: string }>;
export class EventDidsResolve extends BaseEvent<DidDocument> {
  public static token = 'dids.resolve';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, DidDocument);
  }

  public static fromEvent(e: EventDidsResolve) {
    return new EventDidsResolve(e.data, e.tenantId, e.id, e.type, e.timestamp);
  }
}

export type EventDidsRegisterEndorserDidInput = BaseEventInput<
  Record<string, unknown>,
  undefined
>;
export class EventDidsRegisterEndorserDid extends BaseEvent<
  Record<string, unknown>,
  undefined
> {
  public static token = 'dids.register.indy.endorser';

  public static fromEvent(e: EventDidsRegisterEndorserDid) {
    return new EventDidsRegisterEndorserDid(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidsRegisterIndyFromSeedInput = BaseEventInput<{
  seed: string;
  services?: Array<{
    identifier: string;
    url: string;
    type: string;
  }>;
}>;
export class EventDidsRegisterIndyFromSeed extends BaseEvent<Array<string>> {
  public static token = 'dids.register.indy.fromSeed';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventDidsRegisterIndyFromSeed) {
    return new EventDidsRegisterIndyFromSeed(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type DidConfiguration = {
  entries: Array<{ did: string; jwt: string }>;
};
export type EventDidsDidConfigurationInput = BaseEventInput<{
  domain: string;
  expiryTime: number;
}>;
export class EventDidsDidConfiguration extends BaseEvent<DidConfiguration> {
  public static token = 'dids.didConfiguration';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventDidsDidConfiguration) {
    return new EventDidsDidConfiguration(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
