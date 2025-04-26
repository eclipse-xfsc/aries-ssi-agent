import { Test } from '@nestjs/testing';
import { EventTenantsCreate, EventTenantsGetAllTenantIds } from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { TenantsService } from '../tenants.service.js';

describe('TenantsService', () => {
  let service: TenantsService;
  const natsClientMock = { send: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        TenantsService,
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const label = 'label';
      const expectedResult = {} as EventTenantsCreate['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventTenantsCreate(expectedResult, undefined)),
      );

      service
        .create(label)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventTenantsCreate.token,
            { label },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('find', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const expectedResult = [] as string[];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventTenantsGetAllTenantIds(expectedResult, undefined)),
      );

      service
        .find()
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventTenantsGetAllTenantIds.token,
            {},
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
