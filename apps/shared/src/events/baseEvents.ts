import { utils } from '@credo-ts/core';

export class BaseEvent<T = Record<string, unknown>, TenantIdType = string> {
  public readonly id: string;
  public readonly type: string;
  public readonly timestamp: Date;
  public readonly data: T;
  public readonly tenantId: TenantIdType;

  public constructor(
    data: T,
    tenantId: TenantIdType,
    id?: string,
    type?: string,
    timestamp?: Date,
  ) {
    this.data = data;
    this.tenantId = tenantId;

    this.id = id ?? utils.uuid();
    this.type = type ?? this.constructor.name;
    this.timestamp = timestamp ?? new Date();
  }
}

export type BaseEventInput<
  T extends Record<string, unknown> = Record<string, unknown>,
  TenantIdType extends undefined | string = string,
> = TenantIdType extends string ? { tenantId: string } & T : T;
