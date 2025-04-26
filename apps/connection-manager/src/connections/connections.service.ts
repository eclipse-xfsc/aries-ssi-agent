import type {
  EventDidcommConnectionsBlockInput,
  EventDidcommConnectionsGetAllInput,
  EventDidcommConnectionsGetByIdInput,
} from '@ocm/shared';
import type { Observable } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsGetById,
} from '@ocm/shared';
import { map } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public getAllConnections(
    tenantId: string,
  ): Observable<EventDidcommConnectionsGetAll['data']> {
    this.logger.log({
      message: 'Request all connections',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventDidcommConnectionsGetAll,
        EventDidcommConnectionsGetAllInput
      >(EventDidcommConnectionsGetAll.token, { tenantId })
      .pipe(map((result) => result.data));
  }

  public getConnectionById(
    tenantId: string,
    connectionId: string,
  ): Observable<EventDidcommConnectionsGetById['data']> {
    this.logger.log({
      message: 'Request a connection by ID',
      labels: { tenantId },
      'ocm.connections.connectionId': connectionId,
    });
    return this.natsClient
      .send<
        EventDidcommConnectionsGetById,
        EventDidcommConnectionsGetByIdInput
      >(EventDidcommConnectionsGetById.token, { tenantId, id: connectionId })
      .pipe(map((result) => result.data));
  }

  public createConnectionWithSelf(
    tenantId: string,
  ): Observable<EventDidcommConnectionsCreateWithSelf['data']> {
    this.logger.log({
      message: 'Create connection with self',
      labels: { tenantId },
    });
    return this.natsClient
      .send<EventDidcommConnectionsCreateWithSelf>(
        EventDidcommConnectionsCreateWithSelf.token,
        { tenantId },
      )
      .pipe(map((result) => result.data));
  }

  public blockConnection(
    tenantId: string,
    idOrDid: string,
  ): Observable<EventDidcommConnectionsBlock['data']> {
    this.logger.log({
      message: 'Block a connection',
      labels: { tenantId },
      'ocm.connections.idOrDid': idOrDid,
    });
    return this.natsClient
      .send<
        EventDidcommConnectionsBlock,
        EventDidcommConnectionsBlockInput
      >(EventDidcommConnectionsBlock.token, { tenantId, idOrDid })
      .pipe(map((result) => result.data));
  }
}
