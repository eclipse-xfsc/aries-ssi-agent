import type { TestingModule } from '@nestjs/testing';
import type {
  EventDidcommConnectionsCreateInvitation,
  EventDidcommConnectionsReceiveInvitationFromUrl,
} from '@ocm/shared';

import { Test } from '@nestjs/testing';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { InvitationsController } from '../invitations.controller.js';
import { InvitationsService } from '../invitations.service.js';

describe('InvitationsController', () => {
  const natsClientMock = {};

  let controller: InvitationsController;
  let service: InvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitationsController],
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        InvitationsService,
      ],
    }).compile();

    controller = module.get<InvitationsController>(InvitationsController);
    service = module.get<InvitationsService>(InvitationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return an invitation', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventDidcommConnectionsCreateInvitation['data'] = {
        invitationUrl: 'https://example.com/invitation',
      };

      jest
        .spyOn(service, 'createInvitation')
        .mockReturnValue(of(expectedResult));

      controller
        .createInvitation({ tenantId })
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('receive', () => {
    it('should return a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const invitationUrl = 'https://example.com/invitation';
      const expectedResult =
        {} as EventDidcommConnectionsReceiveInvitationFromUrl['data'];

      jest
        .spyOn(service, 'receiveInvitationFromURL')
        .mockReturnValue(of(expectedResult));

      controller
        .receiveInvitation({ tenantId }, { invitationUrl })
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
