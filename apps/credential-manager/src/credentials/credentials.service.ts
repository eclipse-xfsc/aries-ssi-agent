import type {
  EventAnonCredsCredentialsDeleteByIdInput,
  EventAnonCredsCredentialsGetAllInput,
  EventAnonCredsCredentialsGetByIdInput,
  EventAnonCredsRevocationRevokeInput,
} from '@ocm/shared';
import type { Observable } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventAnonCredsRevocationRevoke,
  EventAnonCredsCredentialsDeleteById,
  EventAnonCredsCredentialsGetAll,
  EventAnonCredsCredentialsGetById,
} from '@ocm/shared';
import { map } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public find(
    tenantId: string,
  ): Observable<EventAnonCredsCredentialsGetAll['data']> {
    this.logger.log({
      message: 'Find all credentials',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialsGetAll,
        EventAnonCredsCredentialsGetAllInput
      >(EventAnonCredsCredentialsGetAll.token, {
        tenantId,
      })
      .pipe(map(({ data }) => data));
  }

  public get(
    tenantId: string,
    credentialRecordId: string,
  ): Observable<EventAnonCredsCredentialsGetById['data']> {
    this.logger.log({
      message: 'Get a credential by ID',
      labels: { tenantId },
      'ocm.credentials.credentialRecordId': credentialRecordId,
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialsGetById,
        EventAnonCredsCredentialsGetByIdInput
      >(EventAnonCredsCredentialsGetById.token, {
        tenantId,
        credentialRecordId,
      })
      .pipe(map((response) => response.data));
  }

  public revoke(
    tenantId: string,
    credentialId: string,
  ): Observable<EventAnonCredsRevocationRevoke['data']> {
    this.logger.log({
      message: 'Revoke a credential',
      labels: { tenantId },
      'ocm.credentials.credentialId': credentialId,
    });
    return this.natsClient
      .send<
        EventAnonCredsRevocationRevoke,
        EventAnonCredsRevocationRevokeInput
      >(EventAnonCredsRevocationRevoke.token, {
        tenantId,
        credentialId,
      })
      .pipe(map(({ data }) => data));
  }

  public delete(
    tenantId: string,
    credentialRecordId: string,
  ): Observable<EventAnonCredsCredentialsDeleteById['data']> {
    this.logger.log({
      message: 'Delete a credential by ID',
      labels: { tenantId },
      'ocm.credentials.credentialRecordId': credentialRecordId,
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialsDeleteById,
        EventAnonCredsCredentialsDeleteByIdInput
      >(EventAnonCredsCredentialsDeleteById.token, {
        tenantId,
        credentialRecordId,
      })
      .pipe(map(({ data }) => data));
  }
}
