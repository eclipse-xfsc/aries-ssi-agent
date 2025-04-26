import type { TestingModule } from '@nestjs/testing';
import type { EventTenantsCreate } from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { TenantsController } from '../tenants.controller.js';
import { TenantsService } from '../tenants.service.js';

describe('TenantsController', () => {
  const natsClientMock = {};

  let controller: TenantsController;
  let service: TenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        TenantsService,
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get<TenantsService>(TenantsService);
  });

  describe('create', () => {
    it('should call service.create with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const label = 'label';
      const expectedResult = {} as EventTenantsCreate['data'];

      jest.spyOn(service, 'create').mockReturnValueOnce(of(expectedResult));

      controller
        .create({ label })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(service.create).toHaveBeenCalledWith(label);
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('find', () => {
    it('should call service.find with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const expectedResult = [] as string[];

      jest.spyOn(service, 'find').mockReturnValueOnce(of(expectedResult));

      controller
        .find()
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(service.find).toHaveBeenCalledWith();
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
