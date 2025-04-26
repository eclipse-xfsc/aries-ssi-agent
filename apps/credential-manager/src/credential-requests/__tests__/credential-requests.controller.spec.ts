import type { TestingModule } from '@nestjs/testing';
import type {
  EventAnonCredsCredentialRequestGetAll,
  EventAnonCredsCredentialRequestGetById,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialRequestsController } from '../credential-requests.controller.js';
import { CredentialRequestsService } from '../credential-requests.service.js';

describe('CredentialRequestsController', () => {
  const natsClientMock = {};

  let controller: CredentialRequestsController;
  let service: CredentialRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialRequestsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialRequestsService,
      ],
    }).compile();

    controller = module.get<CredentialRequestsController>(
      CredentialRequestsController,
    );
    service = module.get<CredentialRequestsService>(CredentialRequestsService);
  });

  describe('find', () => {
    it('should return a list of credential requests', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsCredentialRequestGetAll['data'] = [];

      jest
        .spyOn(service, 'findCredentialRequests')
        .mockReturnValueOnce(of(expectedResult));

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
    it('should return a credential request', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const credentialRequestId = 'exampleCredentialRequestId';
      const expectedResult: EventAnonCredsCredentialRequestGetById['data'] = {
        blinded_ms: {},
        blinded_ms_correctness_proof: {},
        cred_def_id: 'cred_def_id',
        nonce: 'nonce',
        entropy: 'entropy',
        prover_did: 'prover_did',
      };

      jest
        .spyOn(service, 'getCredentialRequestById')
        .mockReturnValueOnce(of(expectedResult));

      controller
        .getById({ credentialRequestId }, { tenantId })
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
