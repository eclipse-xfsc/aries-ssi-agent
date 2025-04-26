import type {
  EventAnonCredsCredentialRequestGetAllInput,
  EventAnonCredsCredentialRequestGetById,
  EventAnonCredsCredentialRequestGetByIdInput,
} from '@ocm/shared';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventAnonCredsCredentialRequestGetAll } from '@ocm/shared';
import { map } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class CredentialRequestsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public findCredentialRequests(tenantId: string) {
    this.logger.log({
      message: 'Find all credential requests',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialRequestGetAll,
        EventAnonCredsCredentialRequestGetAllInput
      >(EventAnonCredsCredentialRequestGetAll.token, { tenantId })
      .pipe(map(({ data }) => data));
  }

  public getCredentialRequestById(
    tenantId: string,
    credentialRequestId: string,
  ) {
    this.logger.log({
      message: 'Get a credential request by ID',
      labels: { tenantId },
      'ocm.credentialRequests.credentialRequestId': credentialRequestId,
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialRequestGetById,
        EventAnonCredsCredentialRequestGetByIdInput
      >(EventAnonCredsCredentialRequestGetAll.token, {
        tenantId,
        credentialRequestId,
      })
      .pipe(map(({ data }) => data));
  }
}
