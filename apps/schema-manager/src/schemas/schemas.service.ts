import type {
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';
import { map, type Observable } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class SchemasService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public getAll(
    tenantId: string,
  ): Observable<EventAnonCredsSchemasGetAll['data']> {
    this.logger.log({
      message: 'Find all schemas',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsSchemasGetAll,
        EventAnonCredsSchemasGetAllInput
      >(EventAnonCredsSchemasGetAll.token, { tenantId })
      .pipe(map((result) => result.data));
  }

  public getById(
    tenantId: string,
    schemaId: EventAnonCredsSchemasGetByIdInput['schemaId'],
  ): Observable<EventAnonCredsSchemasGetById['data']> {
    this.logger.log({
      message: 'Get a schema by ID',
      labels: { tenantId },
      'ocm.schemas.schemaId': schemaId,
    });
    return this.natsClient
      .send<
        EventAnonCredsSchemasGetById,
        EventAnonCredsSchemasGetByIdInput
      >(EventAnonCredsSchemasGetById.token, { tenantId, schemaId })
      .pipe(map((result) => result.data));
  }

  public register(
    tenantId: string,
    payload: Omit<EventAnonCredsSchemasRegisterInput, 'tenantId'>,
  ): Observable<EventAnonCredsSchemasRegister['data']> {
    this.logger.log({
      message: 'Register a schema',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsSchemasRegister,
        EventAnonCredsSchemasRegisterInput
      >(EventAnonCredsSchemasRegister.token, { ...payload, tenantId })
      .pipe(map((result) => result.data));
  }
}
