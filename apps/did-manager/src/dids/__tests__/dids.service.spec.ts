import type { EventDidsRegisterIndyFromSeedInput } from '@ocm/shared';

import { Test } from '@nestjs/testing';
import {
  EventDidsDidConfiguration,
  EventDidsRegisterIndyFromSeed,
  EventDidsResolve,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { DIDsService } from '../dids.service.js';

describe('DIDsService', () => {
  let service: DIDsService;
  const natsClientMock = { send: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        DIDsService,
      ],
    }).compile();

    service = module.get<DIDsService>(DIDsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resolve', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const did = 'did';
      const expectedResult = {} as EventDidsResolve['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventDidsResolve(expectedResult, tenantId)),
      );

      service
        .resolve(tenantId, did)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventDidsResolve.token,
            { tenantId, did },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('registerFromSeed', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const seed = 'seed';
      const services: EventDidsRegisterIndyFromSeedInput['services'] = [
        {
          type: 'indy',
          url: 'url',
          identifier: 'identifier',
        },
      ];
      const expectedResult = {} as EventDidsRegisterIndyFromSeed['data'];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventDidsRegisterIndyFromSeed(expectedResult, tenantId)),
      );

      service
        .registerFromSeed(tenantId, seed, services)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventDidsRegisterIndyFromSeed.token,
            { tenantId, seed, services },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getConfiguration', () => {
    it('should call natsClient.send with the correct arguments', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'tenantId';
      const domain = 'domain';
      const expiryTime = 1;
      const expectedResult: EventDidsDidConfiguration['data'] = {
        entries: [],
      };

      natsClientMock.send.mockReturnValueOnce(
        of(new EventDidsDidConfiguration(expectedResult, tenantId)),
      );

      service
        .getConfiguration(tenantId, domain, expiryTime)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            EventDidsDidConfiguration.token,
            { tenantId, domain, expiryTime },
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
