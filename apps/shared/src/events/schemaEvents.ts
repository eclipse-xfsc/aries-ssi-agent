import type { BaseEventInput } from './baseEvents.js';
import type { AnonCredsSchema } from '@credo-ts/anoncreds';

import { BaseEvent } from './baseEvents.js';

export type AnonCredsSchemaWithId = AnonCredsSchema & {
  schemaId: string;
};

export type EventAnonCredsSchemasGetAllInput = BaseEventInput;
export class EventAnonCredsSchemasGetAll extends BaseEvent<
  Array<AnonCredsSchema>
> {
  public static token = 'anoncreds.schemas.getAll';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsSchemasGetAll) {
    return new EventAnonCredsSchemasGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsSchemasGetByIdInput = BaseEventInput<{
  schemaId: string;
}>;
export class EventAnonCredsSchemasGetById extends BaseEvent<AnonCredsSchema | null> {
  public static token = 'anoncreds.schemas.getById';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsSchemasGetById) {
    return new EventAnonCredsSchemasGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsSchemasRegisterInput = BaseEventInput<{
  issuerDid: string;
  name: string;
  version: string;
  attributeNames: Array<string>;
}>;
export class EventAnonCredsSchemasRegister extends BaseEvent<AnonCredsSchemaWithId> {
  public static token = 'anoncreds.schemas.register';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsSchemasRegister) {
    return new EventAnonCredsSchemasRegister(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
