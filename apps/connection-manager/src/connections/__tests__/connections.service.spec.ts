import type { ClientProxy } from '@nestjs/microservices';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import {
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsGetById,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { ConnectionsService } from '../connections.service.js';

describe('ConnectionsService', () => {
  let service: ConnectionsService;
  let natsClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionsService,
        {
          provide: NATS_CLIENT,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConnectionsService>(ConnectionsService);
    natsClient = module.get<ClientProxy>(NATS_CLIENT);
  });

  describe('getAllConnections', () => {
    it('should return all connections', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventDidcommConnectionsGetAll['data'] = [];

      jest
        .spyOn(natsClient, 'send')
        .mockReturnValue(
          of(new EventDidcommConnectionsGetAll(expectedResult, tenantId)),
        );

      service
        .getAllConnections(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClient.send).toHaveBeenCalledWith(
            EventDidcommConnectionsGetAll.token,
            { tenantId },
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getConnectionById', () => {
    it('should return a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const connectionId = 'exampleConnectionId';
      const expectedResult = {} as EventDidcommConnectionsGetById['data'];

      jest
        .spyOn(natsClient, 'send')
        .mockReturnValue(
          of(new EventDidcommConnectionsGetById(expectedResult, tenantId)),
        );

      service
        .getConnectionById(tenantId, connectionId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClient.send).toHaveBeenCalledWith(
            EventDidcommConnectionsGetById.token,
            { tenantId, id: connectionId },
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('createConnectionWithSelf', () => {
    it('should create a connection with self', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult =
        {} as EventDidcommConnectionsCreateWithSelf['data'];

      jest
        .spyOn(natsClient, 'send')
        .mockReturnValue(
          of(
            new EventDidcommConnectionsCreateWithSelf(expectedResult, tenantId),
          ),
        );

      service
        .createConnectionWithSelf(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClient.send).toHaveBeenCalledWith(
            EventDidcommConnectionsCreateWithSelf.token,
            { tenantId },
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('blockConnection', () => {
    it('should block a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const idOrDid = 'exampleConnectionId';
      const expectedResult = {} as EventDidcommConnectionsBlock['data'];

      jest
        .spyOn(natsClient, 'send')
        .mockReturnValue(
          of(new EventDidcommConnectionsBlock(expectedResult, tenantId)),
        );

      service
        .blockConnection(tenantId, idOrDid)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClient.send).toHaveBeenCalledWith(
            EventDidcommConnectionsBlock.token,
            { tenantId, idOrDid },
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
