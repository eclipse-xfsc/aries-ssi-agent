import type { TestingModule } from '@nestjs/testing';
import type {
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import {
  EventAnonCredsCredentialOfferGetAll,
  EventAnonCredsCredentialOfferGetById,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommAnonCredsCredentialsOfferToSelf,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialOffersService } from '../credential-offers.service.js';

describe('CredentialOffersService', () => {
  const natsClientMock = { send: jest.fn() };
  let service: CredentialOffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialOffersService,
      ],
    }).compile();

    service = module.get<CredentialOffersService>(CredentialOffersService);
  });

  describe('findCredentialOffers', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const expectedResult: EventAnonCredsCredentialOfferGetAll['data'] = [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialOfferGetAll(expectedResult, tenantId)),
      );

      service
        .findCredentialOffers(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialOfferGetAll.token,
            { tenantId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getCredentialOfferById', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const credentialOfferId = 'id';
      const expectedResult: EventAnonCredsCredentialOfferGetById['data'] = {
        cred_def_id: 'exampleCredDefId',
        key_correctness_proof: {},
        nonce: 'exampleNonce',
        schema_id: 'exampleSchemaId',
      };

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialOfferGetById(expectedResult, tenantId)),
      );

      service
        .getCredentialOfferById(tenantId, credentialOfferId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialOfferGetById.token,
            { tenantId, credentialOfferId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('createCredentialOffer', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const connectionId = 'connectionId';
      const credentialDefinitionId = 'credentialDefinitionId';
      const attributes: EventDidcommAnonCredsCredentialsOfferInput['attributes'] =
        [];
      const expectedResult =
        {} as EventDidcommAnonCredsCredentialsOffer['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventDidcommAnonCredsCredentialsOffer(expectedResult, tenantId)),
      );

      service
        .offer(tenantId, connectionId, credentialDefinitionId, attributes)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventDidcommAnonCredsCredentialsOffer.token,
            {
              tenantId,
              connectionId,
              credentialDefinitionId,
              attributes,
            },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('createCredentialOfferToSelf', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const credentialDefinitionId = 'credentialDefinitionId';
      const attributes: EventDidcommAnonCredsCredentialsOfferToSelfInput['attributes'] =
        [];
      const expectedResult =
        {} as EventDidcommAnonCredsCredentialsOfferToSelf['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(
          new EventDidcommAnonCredsCredentialsOfferToSelf(
            expectedResult,
            tenantId,
          ),
        ),
      );

      service
        .offerToSelf(tenantId, credentialDefinitionId, attributes)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventDidcommAnonCredsCredentialsOfferToSelf.token,
            {
              tenantId,
              credentialDefinitionId,
              attributes,
            },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
