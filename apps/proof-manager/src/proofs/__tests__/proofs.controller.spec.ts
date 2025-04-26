import type { TestingModule } from '@nestjs/testing';
import type {
  EventAnonCredsProofsDeleteById,
  EventAnonCredsProofsGetAll,
  EventAnonCredsProofsGetById,
  EventDidcommAnonCredsProofsRequest,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { ProofsController } from '../proofs.controller.js';
import { ProofsService } from '../proofs.service.js';

describe('ProofsController', () => {
  const natsClientMock = {};

  let controller: ProofsController;
  let service: ProofsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProofsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        ProofsService,
      ],
    }).compile();

    controller = module.get<ProofsController>(ProofsController);
    service = module.get<ProofsService>(ProofsService);
  });

  describe('find', () => {
    it('should return a list of schemas', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventAnonCredsProofsGetAll['data'] = [];

      jest.spyOn(service, 'find').mockReturnValue(of(expectedResult));

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
    it('should return a schema by id', (done) => {
      const unsubscribe$ = new Subject<void>();
      const proofRecordId = 'exampleProofRecordId';
      const tenantId = 'exampleTenantId';
      const expectedResult = {} as NonNullable<
        EventAnonCredsProofsGetById['data']
      >;

      jest.spyOn(service, 'getById').mockReturnValue(of(expectedResult));

      controller
        .get({ proofRecordId }, { tenantId })
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
      const proofRecordId = 'exampleProofRecordId';
      const tenantId = 'exampleTenantId';

      jest.spyOn(service, 'getById').mockReturnValue(of(null));

      controller
        .get({ proofRecordId }, { tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe({
          error: (error) => {
            expect(error.status).toBe(404);
            expect(error.message).toBe(
              `Presentation proof with id ${proofRecordId} not found`,
            );

            unsubscribe$.next();
            unsubscribe$.complete();

            done();
          },
        });
    });
  });

  describe('request', () => {
    it('should return a proof record', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const name = 'exampleName';
      const connectionId = 'exampleConnectionId';
      const requestedAttributes = {};
      const requestedPredicates = {};
      const expectedResult = {} as EventDidcommAnonCredsProofsRequest['data'];

      jest.spyOn(service, 'request').mockReturnValue(of(expectedResult));

      controller
        .request(
          { tenantId },
          { name, connectionId, requestedAttributes, requestedPredicates },
        )
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
    it('should return a proof record', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const proofRecordId = 'exampleProofRecordId';
      const expectedResult = {} as EventAnonCredsProofsDeleteById['data'];

      jest.spyOn(service, 'delete').mockReturnValue(of(expectedResult));

      controller
        .delete({ proofRecordId }, { tenantId })
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
