import type { BaseEventInput } from './baseEvents.js';

import { JsonTransformer } from '@credo-ts/core';
import { TenantRecord } from '@credo-ts/tenants';

import { BaseEvent } from './baseEvents.js';

export type EventTenantsCreateInput = BaseEventInput<
  { label: string },
  undefined
>;
export class EventTenantsCreate extends BaseEvent<TenantRecord, undefined> {
  public static token = 'tenants.create';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, TenantRecord);
  }

  public static fromEvent(e: EventTenantsCreate) {
    return new EventTenantsCreate(e.data, undefined, e.id, e.type, e.timestamp);
  }
}

export type EventTenantsGetAllTenantIdsInput = BaseEventInput<
  Record<string, unknown>,
  undefined
>;
export class EventTenantsGetAllTenantIds extends BaseEvent<
  Array<string>,
  undefined
> {
  public static token = 'tenants.getAllTenantIds';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventTenantsGetAllTenantIds) {
    return new EventTenantsGetAllTenantIds(
      e.data,
      undefined,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
