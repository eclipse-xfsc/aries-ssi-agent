import type {
  EventAnonCredsCredentialsDeleteById,
  EventAnonCredsCredentialsGetAll,
  EventAnonCredsCredentialsGetById,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialsController } from '../credentials.controller.js';
import { CredentialsService } from '../credentials.service.js';

describe('CredentialsController', () => {
  const natsClientMock = {};

  let controller: CredentialsController;
  let service: CredentialsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CredentialsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialsService,
      ],
    }).compile();

    controller = moduleRef.get<CredentialsController>(CredentialsController);
    service = moduleRef.get<CredentialsService>(CredentialsService);
  });

  describe('find', () => {
    it('should return a list of credentials', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsCredentialsGetAll['data'] = [];

      jest
        .spyOn(service, 'find')
        .mockImplementationOnce(() => of(expectedResult));

      controller
        .find({ tenantId })
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
    it('should return a credential', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const credentialRecordId = 'exampleCredentialRecordId';
      const expectedResult = {} as EventAnonCredsCredentialsGetById['data'];

      jest
        .spyOn(service, 'get')
        .mockImplementationOnce(() => of(expectedResult));

      controller
        .get({ credentialRecordId }, { tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('delete', () => {
    it('should delete a credential', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const credentialRecordId = 'exampleCredentialRecordId';
      const expectedResult = {} as EventAnonCredsCredentialsDeleteById['data'];

      jest
        .spyOn(service, 'delete')
        .mockImplementationOnce(() => of(expectedResult));

      controller
        .delete({ credentialRecordId }, { tenantId })
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
