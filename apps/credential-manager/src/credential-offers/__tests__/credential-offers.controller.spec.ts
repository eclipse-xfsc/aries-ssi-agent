import type { TestingModule } from '@nestjs/testing';
import type {
  EventAnonCredsCredentialOfferGetAll,
  EventAnonCredsCredentialOfferGetById,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialOffersController } from '../credential-offers.controller.js';
import { CredentialOffersService } from '../credential-offers.service.js';

describe('CredentialOffersController', () => {
  const natsClientMock = {};

  let controller: CredentialOffersController;
  let service: CredentialOffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialOffersController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialOffersService,
      ],
    }).compile();

    controller = module.get<CredentialOffersController>(
      CredentialOffersController,
    );
    service = module.get<CredentialOffersService>(CredentialOffersService);
  });

  describe('find', () => {
    it('should return a list of credential offers', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsCredentialOfferGetAll['data'] = [];

      jest
        .spyOn(service, 'findCredentialOffers')
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
    it('should return a credential offer', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const credentialOfferId = 'exampleCredentialOfferId';
      const expectedResult: EventAnonCredsCredentialOfferGetById['data'] = {
        cred_def_id: 'exampleCredDefId',
        key_correctness_proof: {},
        nonce: 'exampleNonce',
        schema_id: 'exampleSchemaId',
      };

      jest
        .spyOn(service, 'getCredentialOfferById')
        .mockReturnValueOnce(of(expectedResult));

      controller
        .getById({ credentialOfferId }, { tenantId })
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
