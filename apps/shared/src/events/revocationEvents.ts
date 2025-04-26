import type { BaseEventInput } from './baseEvents.js';

import { BaseEvent } from './baseEvents.js';

export enum RevocationState {
  Issued,
  Revoked,
}

export type EventAnonCredsRevocationRevokeInput = BaseEventInput<{
  credentialId: string;
}>;
export class EventAnonCredsRevocationRevoke extends BaseEvent {
  public static token = 'anoncreds.revocation.revoke';

  public get instance() {
    return null;
  }

  public static fromEvent(e: EventAnonCredsRevocationRevoke) {
    return new EventAnonCredsRevocationRevoke(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput =
  BaseEventInput<{
    issuerDid: string;
    tag: string;
    credentialDefinitionId: string;
    maximumCredentialNumber: number;
  }>;
export class EventAnonCredsRevocationRegisterRevocationRegistryDefinition extends BaseEvent<{
  revocationRegistryDefinitionId: string;
}> {
  public static token =
    'anoncreds.revocation.registerRevocationRegistryDefinition';

  public get instance() {
    return this.data;
  }

  public static fromEvent(
    e: EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
  ) {
    return new EventAnonCredsRevocationRegisterRevocationRegistryDefinition(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsRevocationRegisterRevocationStatusListInput =
  BaseEventInput<{
    revocationRegistryDefinitionId: string;
    issuerDid: string;
  }>;
export class EventAnonCredsRevocationRegisterRevocationStatusList extends BaseEvent {
  public static token = 'anoncreds.revocation.registerRevocationStatusList';

  public get instance() {
    return this.data;
  }

  public static fromEvent(
    e: EventAnonCredsRevocationRegisterRevocationStatusList,
  ) {
    return new EventAnonCredsRevocationRegisterRevocationStatusList(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsRevocationTailsFileInput = BaseEventInput<{
  revocationRegistryDefinitionId: string;
}>;
export class EventAnonCredsRevocationTailsFile extends BaseEvent<{
  tailsFile: Uint8Array;
}> {
  public static token = 'anoncreds.revocation.tailsFile';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsRevocationTailsFile) {
    return new EventAnonCredsRevocationTailsFile(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsRevocationCheckCredentialStatusInput =
  BaseEventInput<{
    credentialId: string;
  }>;
export class EventAnonCredsRevocationCheckCredentialStatus extends BaseEvent<{
  state: RevocationState;
}> {
  public static token = 'anoncreds.revocation.checkCredentialStatus';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsRevocationCheckCredentialStatus) {
    return new EventAnonCredsRevocationCheckCredentialStatus(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
