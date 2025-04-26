import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import {
  EventAnonCredsProofsDeleteById,
  EventAnonCredsProofsGetAll,
  EventAnonCredsProofsGetById,
  EventDidcommAnonCredsProofsRequest,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { ProofsService } from '../proofs.service.js';

describe('ProofsService', () => {
  let service: ProofsService;
  const natsClientMock = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        ProofsService,
      ],
    }).compile();

    service = module.get<ProofsService>(ProofsService);

    jest.resetAllMocks();
  });

  describe('getAll', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'mocked tenantId';
      const expectedResult: EventAnonCredsProofsGetAll['data'] = [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsProofsGetAll([], tenantId)),
      );

      service
        .find(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsProofsGetAll.token,
            { tenantId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getById', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'mocked tenantId';
      const proofRecordId = 'mocked id';
      const expectedResult = {} as EventAnonCredsProofsGetById['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsProofsGetById(expectedResult, tenantId)),
      );

      service
        .getById(tenantId, proofRecordId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsProofsGetById.token,
            { tenantId, proofRecordId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('request', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'mocked tenantId';
      const name = 'mocked name';
      const connectionId = 'mocked connectionId';
      const requestedAttributes = {};
      const requestedPredicates = {};
      const expectedResult = {
        name,
        connectionId,
        requestedAttributes,
        requestedPredicates,
      } as unknown as EventDidcommAnonCredsProofsRequest['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventDidcommAnonCredsProofsRequest(expectedResult, tenantId)),
      );

      service
        .request(
          tenantId,
          name,
          connectionId,
          requestedAttributes,
          requestedPredicates,
        )
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventDidcommAnonCredsProofsRequest.token,
            {
              name,
              connectionId,
              requestedAttributes,
              requestedPredicates,
              tenantId,
            },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('delete', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'mocked tenantId';
      const proofRecordId = 'mocked id';
      const expectedResult = {} as EventAnonCredsProofsGetById['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsProofsGetById(expectedResult, tenantId)),
      );

      service
        .delete(tenantId, proofRecordId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsProofsDeleteById.token,
            { tenantId, proofRecordId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
