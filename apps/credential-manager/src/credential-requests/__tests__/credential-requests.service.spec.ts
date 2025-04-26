import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import { EventAnonCredsCredentialRequestGetAll } from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialRequestsService } from '../credential-requests.service.js';

describe('CredentialRequestsService', () => {
  const natsClientMock = { send: jest.fn() };
  let service: CredentialRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialRequestsService,
      ],
    }).compile();

    service = module.get<CredentialRequestsService>(CredentialRequestsService);
  });

  describe('findCredentialRequests', () => {
    it('should call the natsClient send method with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const expectedResult: EventAnonCredsCredentialRequestGetAll['data'] = [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialRequestGetAll(expectedResult, tenantId)),
      );

      service
        .findCredentialRequests(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialRequestGetAll.token,
            { tenantId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getCredentialRequestById', () => {
    it('should call the natsClient send method with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const credentialRequestId = 'credentialRequestId';
      const expectedResult: EventAnonCredsCredentialRequestGetAll['data'] = [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialRequestGetAll(expectedResult, tenantId)),
      );

      service
        .getCredentialRequestById(tenantId, credentialRequestId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialRequestGetAll.token,
            { tenantId, credentialRequestId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
