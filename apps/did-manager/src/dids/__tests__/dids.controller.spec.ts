import type { TestingModule } from '@nestjs/testing';
import type {
  EventDidsDidConfiguration,
  EventDidsRegisterIndyFromSeed,
  EventDidsRegisterIndyFromSeedInput,
  EventDidsResolve,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { DIDsController } from '../dids.controller.js';
import { DIDsService } from '../dids.service.js';

describe('DIDsController', () => {
  const natsClientMock = {};

  let controller: DIDsController;
  let service: DIDsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DIDsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        DIDsService,
      ],
    }).compile();

    controller = module.get<DIDsController>(DIDsController);
    service = module.get<DIDsService>(DIDsService);
  });

  describe('resolve', () => {
    it('should call service.resolve with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const did = 'did';
      const expectedResult = {} as EventDidsResolve['data'];

      jest.spyOn(service, 'resolve').mockReturnValueOnce(of(expectedResult));

      controller
        .resolve({ tenantId }, { did })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(service.resolve).toHaveBeenCalledWith(tenantId, did);
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('registerFromSeed', () => {
    it('should call service.registerFromSeed with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const seed = 'seed';
      const services: EventDidsRegisterIndyFromSeedInput['services'] = [
        {
          identifier: 'serviceId',
          type: 'serviceType',
          url: 'serviceUrl',
        },
      ];
      const expectedResult = {} as EventDidsRegisterIndyFromSeed['data'];

      jest
        .spyOn(service, 'registerFromSeed')
        .mockReturnValueOnce(of(expectedResult));

      controller
        .registerFromSeed({ tenantId }, { seed, services })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(service.registerFromSeed).toHaveBeenCalledWith(
            tenantId,
            seed,
            services,
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getConfiguration', () => {
    it('should call service.getConfiguration with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const domain = 'domain';
      const expiryTime = 123;
      const expectedResult = {} as EventDidsDidConfiguration['data'];

      jest
        .spyOn(service, 'getConfiguration')
        .mockReturnValueOnce(of(expectedResult));

      controller
        .getConfiguration({ tenantId }, { domain, expiryTime })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(service.getConfiguration).toHaveBeenCalledWith(
            tenantId,
            domain,
            expiryTime,
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
