import type { CreateCredentialDefinitionPayload } from '../dto/create-credential-definition.dto.js';
import type { TestingModule } from '@nestjs/testing';
import type {
  EventAnonCredsCredentialDefinitionsGetAll,
  EventAnonCredsCredentialDefinitionsGetById,
  EventAnonCredsCredentialDefinitionsRegister,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialDefinitionsController } from '../credential-definitions.controller.js';
import { CredentialDefinitionsService } from '../credential-definitions.service.js';

describe('CredentialDefinitionsController', () => {
  const natsClientMock = {};

  let controller: CredentialDefinitionsController;
  let service: CredentialDefinitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialDefinitionsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        CredentialDefinitionsService,
      ],
    }).compile();

    controller = module.get<CredentialDefinitionsController>(
      CredentialDefinitionsController,
    );
    service = module.get<CredentialDefinitionsService>(
      CredentialDefinitionsService,
    );
  });

  describe('find', () => {
    it('should return a list of credential definitions', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsCredentialDefinitionsGetAll['data'] =
        [];

      jest
        .spyOn(service, 'findCredentialDefinitions')
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

  describe('get', () => {
    it('should return a credential definition', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const credentialDefinitionId = 'exampleCredentialDefinitionId';
      const expectedResult: EventAnonCredsCredentialDefinitionsGetById['data'] =
        {
          credentialDefinitionId: 'exampleCredentialDefinitionId',
          issuerId: 'exampleIssuerId',
          schemaId: 'exampleSchemaId',
          tag: 'exampleTag',
          type: 'CL',
          value: {
            primary: {},
            revocation: {},
          },
        };

      jest
        .spyOn(service, 'getCredentialDefinitionById')
        .mockReturnValueOnce(of(expectedResult));

      controller
        .get({ tenantId }, credentialDefinitionId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('register', () => {
    it('should return a credential definition', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const payload: CreateCredentialDefinitionPayload = {
        schemaId: 'exampleSchemaId',
        tag: 'exampleTag',
      };
      const expectedResult: EventAnonCredsCredentialDefinitionsRegister['data'] =
        {
          credentialDefinitionId: 'exampleCredentialDefinitionId',
          issuerId: 'exampleIssuerId',
          schemaId: 'exampleSchemaId',
          tag: 'exampleTag',
          type: 'CL',
          value: {
            primary: {},
            revocation: {},
          },
        };

      jest
        .spyOn(service, 'registerCredentialDefinition')
        .mockReturnValueOnce(of(expectedResult));

      controller
        .register({ tenantId }, payload)
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
