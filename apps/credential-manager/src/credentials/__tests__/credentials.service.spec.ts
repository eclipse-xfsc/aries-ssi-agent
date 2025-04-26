import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import {
  EventAnonCredsCredentialsDeleteById,
  EventAnonCredsCredentialsGetAll,
  EventAnonCredsCredentialsGetById,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialsService } from '../credentials.service.js';

describe('CredentialsService', () => {
  const natsClientMock = { send: jest.fn() };
  let service: CredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialsService,
      ],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
  });

  describe('find', () => {
    it('should call the natsClient send method with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const expectedResult: EventAnonCredsCredentialsGetAll['data'] = [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialsGetAll(expectedResult, tenantId)),
      );

      service
        .find(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialsGetAll.token,
            { tenantId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('get', () => {
    it('should call the natsClient send method with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const credentialRecordId = 'credentialRecordId';
      const expectedResult = {} as EventAnonCredsCredentialsGetById['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialsGetById(expectedResult, tenantId)),
      );

      service
        .get(tenantId, credentialRecordId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialsGetById.token,
            { tenantId, credentialRecordId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('delete', () => {
    it('should call the natsClient send method with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const credentialRecordId = 'credentialRecordId';
      const expectedResult = {} as EventAnonCredsCredentialsDeleteById['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialsDeleteById(expectedResult, tenantId)),
      );

      service
        .delete(tenantId, credentialRecordId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialsDeleteById.token,
            { tenantId, credentialRecordId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
