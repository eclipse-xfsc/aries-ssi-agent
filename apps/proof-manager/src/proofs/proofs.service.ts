import type {
  EventAnonCredsProofsDeleteByIdInput,
  EventAnonCredsProofsGetAllInput,
  EventAnonCredsProofsGetByIdInput,
  EventDidcommAnonCredsProofsAcceptRequestInput,
  EventDidcommAnonCredsProofsRequestInput,
} from '@ocm/shared';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventDidcommAnonCredsProofsAcceptRequest,
  EventAnonCredsProofsDeleteById,
  EventAnonCredsProofsGetById,
  EventDidcommAnonCredsProofsRequest,
  EventAnonCredsProofsGetAll,
} from '@ocm/shared';
import { map, type Observable } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class ProofsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public find(
    tenantId: string,
  ): Observable<EventAnonCredsProofsGetAll['data']> {
    this.logger.log({
      message: 'Find all proofs',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsProofsGetAll,
        EventAnonCredsProofsGetAllInput
      >(EventAnonCredsProofsGetAll.token, { tenantId })
      .pipe(map((result) => result.data));
  }

  public getById(
    tenantId: string,
    proofRecordId: string,
  ): Observable<EventAnonCredsProofsGetById['data']> {
    this.logger.log({
      message: 'Get a proof by ID',
      labels: { tenantId },
      'ocm.proofs.proofRecordId': proofRecordId,
    });
    return this.natsClient
      .send<EventAnonCredsProofsGetById, EventAnonCredsProofsGetByIdInput>(
        EventAnonCredsProofsGetById.token,
        {
          tenantId,
          proofRecordId,
        },
      )
      .pipe(map((results) => results.data));
  }

  public request(
    tenantId: string,
    name: EventDidcommAnonCredsProofsRequestInput['name'],
    connectionId: EventDidcommAnonCredsProofsRequestInput['connectionId'],
    requestedAttributes: EventDidcommAnonCredsProofsRequestInput['requestedAttributes'],
    requestedPredicates: EventDidcommAnonCredsProofsRequestInput['requestedPredicates'],
  ): Observable<EventDidcommAnonCredsProofsRequest['data']> {
    this.logger.log({
      message: 'Request proof',
      labels: { tenantId },
      'ocm.proofs.name': name,
      'ocm.proofs.connectionId': connectionId,
      'ocm.proofs.requestedAttributes': requestedAttributes,
      'ocm.proofs.requestedPredicates': requestedPredicates,
    });
    return this.natsClient
      .send<
        EventDidcommAnonCredsProofsRequest,
        EventDidcommAnonCredsProofsRequestInput
      >(EventDidcommAnonCredsProofsRequest.token, {
        tenantId,
        name,
        connectionId,
        requestedAttributes,
        requestedPredicates,
      })
      .pipe(map((results) => results.data));
  }

  public accept(
    tenantId: string,
    proofRecordId: string,
  ): Observable<EventDidcommAnonCredsProofsAcceptRequest['data']> {
    this.logger.log({
      message: 'Accept proof request',
      labels: { tenantId },
      'ocm.proofs.proofRecordId': proofRecordId,
    });
    return this.natsClient
      .send<
        EventDidcommAnonCredsProofsAcceptRequest,
        EventDidcommAnonCredsProofsAcceptRequestInput
      >(EventDidcommAnonCredsProofsAcceptRequest.token, {
        tenantId,
        proofRecordId,
      })
      .pipe(map((results) => results.data));
  }

  public delete(
    tenantId: string,
    proofRecordId: string,
  ): Observable<EventAnonCredsProofsDeleteById['data']> {
    this.logger.log({
      message: 'Delete proof by ID',
      labels: { tenantId },
      'ocm.proofs.proofRecordId': proofRecordId,
    });
    return this.natsClient
      .send<
        EventAnonCredsProofsDeleteById,
        EventAnonCredsProofsDeleteByIdInput
      >(EventAnonCredsProofsDeleteById.token, { tenantId, proofRecordId })
      .pipe(map((results) => results.data));
  }
}
