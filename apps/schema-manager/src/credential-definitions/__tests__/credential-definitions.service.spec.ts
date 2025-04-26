import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import {
  EventAnonCredsCredentialDefinitionsGetAll,
  EventAnonCredsCredentialDefinitionsGetById,
  EventAnonCredsCredentialDefinitionsRegister,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialDefinitionsService } from '../credential-definitions.service.js';

describe('CredentialDefinitionsService', () => {
  let service: CredentialDefinitionsService;
  const natsClientMock = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialDefinitionsService,
      ],
    }).compile();

    service = module.get<CredentialDefinitionsService>(
      CredentialDefinitionsService,
    );

    jest.resetAllMocks();
  });

  describe('findCredentialDefinitions', () => {
    it('should call natsClient.send with the correct pattern and payload', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'testTenantId';
      const expectedResult: EventAnonCredsCredentialDefinitionsGetAll['data'] =
        [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsCredentialDefinitionsGetAll([], tenantId)),
      );

      service
        .findCredentialDefinitions(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialDefinitionsGetAll.token,
            { tenantId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getCredentialDefinitionById', () => {
    it('should call natsClient.send with the correct pattern and payload', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'testTenantId';
      const credentialDefinitionId = 'testCredentialDefinitionId';
      const expectedResult: EventAnonCredsCredentialDefinitionsGetById['data'] =
        {
          credentialDefinitionId: 'testCredentialDefinitionId',
          issuerId: 'testIssuerId',
          schemaId: 'testSchemaId',
          tag: 'testTag',
          type: 'CL',
          value: {
            primary: {},
            revocation: {},
          },
        };

      natsClientMock.send.mockReturnValueOnce(
        of(
          new EventAnonCredsCredentialDefinitionsGetById(
            expectedResult,
            tenantId,
          ),
        ),
      );

      service
        .getCredentialDefinitionById(tenantId, credentialDefinitionId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialDefinitionsGetById.token,
            { tenantId, credentialDefinitionId },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('createCredentialDefinition', () => {
    it('should call natsClient.send with the correct pattern and payload', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'testTenantId';
      const payload = { test: 'payload' };
      const expectedResult: EventAnonCredsCredentialDefinitionsRegister['data'] =
        {
          credentialDefinitionId: 'testCredentialDefinitionId',
          issuerId: 'testIssuerId',
          schemaId: 'testSchemaId',
          tag: 'testTag',
          type: 'CL',
          value: {
            primary: {},
            revocation: {},
          },
        };

      natsClientMock.send.mockReturnValueOnce(
        of(
          new EventAnonCredsCredentialDefinitionsRegister(
            expectedResult,
            tenantId,
          ),
        ),
      );

      service
        .registerCredentialDefinition(tenantId, payload)
        .pipe(takeUntil(unsubscribe$))
        .subscribe(() => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventAnonCredsCredentialDefinitionsRegister.token,
            { tenantId, payload },
          );

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
