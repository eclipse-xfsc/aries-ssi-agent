import type { RegisterSchemaPayload } from '../dto/register-schema.dto.js';
import type { TestingModule } from '@nestjs/testing';
import type {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { SchemasController } from '../schemas.controller.js';
import { SchemasService } from '../schemas.service.js';

describe('SchemasController', () => {
  const natsClientMock = {};

  let controller: SchemasController;
  let service: SchemasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemasController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        SchemasService,
      ],
    }).compile();

    controller = module.get<SchemasController>(SchemasController);
    service = module.get<SchemasService>(SchemasService);
  });

  describe('getAll', () => {
    it('should return a list of schemas', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsSchemasGetAll['data'] = [];

      jest.spyOn(service, 'getAll').mockReturnValue(of(expectedResult));

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
    it('should return a schema by id', (done) => {
      const unsubscribe$ = new Subject<void>();
      const schemaId = 'exampleSchemaId';
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsSchemasGetById['data'] = {
        attrNames: ['exampleAttributeName'],
        issuerId: 'exampleIssuerDid',
        name: 'exampleName',
        version: '1.0.0',
      };

      jest.spyOn(service, 'getById').mockReturnValue(of(expectedResult));

      controller
        .getById({ schemaId }, { tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });

    it('should throw a NotFoundException if the service returned null', (done) => {
      const unsubscribe$ = new Subject<void>();
      const schemaId = 'exampleSchemaId';
      const tenantId = 'exampleTenantId';

      jest.spyOn(service, 'getById').mockReturnValue(of(null));

      controller
        .getById({ schemaId }, { tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe({
          error: (error) => {
            expect(error.status).toBe(404);
            expect(error.message).toBe(`Schema with id ${schemaId} not found`);

            unsubscribe$.next();
            unsubscribe$.complete();

            done();
          },
        });
    });
  });

  describe('register', () => {
    it('should register a new schema', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const payload: RegisterSchemaPayload = {
        attributeNames: ['exampleAttributeName'],
        issuerDid: 'exampleIssuerDid',
        name: 'exampleName',
        version: '1.0.0',
      };
      const expectedResult: EventAnonCredsSchemasRegister['data'] = {
        attrNames: payload.attributeNames,
        issuerId: payload.issuerDid,
        name: payload.name,
        version: payload.version,
      };

      jest.spyOn(service, 'register').mockReturnValue(of(expectedResult));

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
