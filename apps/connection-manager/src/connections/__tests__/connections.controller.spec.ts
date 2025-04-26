import type { TestingModule } from '@nestjs/testing';
import type {
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsGetById,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { ConnectionsController } from '../connections.controller.js';
import { ConnectionsService } from '../connections.service.js';

describe('ConnectionsController', () => {
  const natsClientMock = {};

  let controller: ConnectionsController;
  let service: ConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        ConnectionsService,
      ],
    }).compile();

    controller = module.get<ConnectionsController>(ConnectionsController);
    service = module.get<ConnectionsService>(ConnectionsService);
  });

  describe('getAll', () => {
    it('should return a list of connections', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventDidcommConnectionsGetAll['data'] = [];

      jest
        .spyOn(service, 'getAllConnections')
        .mockReturnValue(of(expectedResult));

      controller
        .getAll({ tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getById', () => {
    it('should return a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const connectionId = 'exampleConnectionId';
      const expectedResult = {} as EventDidcommConnectionsGetById['data'];

      jest
        .spyOn(service, 'getConnectionById')
        .mockReturnValue(of(expectedResult));

      controller
        .getById({ connectionId }, { tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('createWithSelf', () => {
    it('should return a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult =
        {} as EventDidcommConnectionsCreateWithSelf['data'];

      jest
        .spyOn(service, 'createConnectionWithSelf')
        .mockReturnValue(of(expectedResult));

      controller
        .createWithSelf({ tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('block', () => {
    it('should return a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const idOrDid = 'exampleConnectionId';
      const expectedResult = {} as EventDidcommConnectionsGetById['data'];

      jest
        .spyOn(service, 'blockConnection')
        .mockReturnValue(of(expectedResult));

      controller
        .block({ idOrDid }, { tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
