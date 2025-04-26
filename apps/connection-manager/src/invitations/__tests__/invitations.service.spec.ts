import type { ClientProxy } from '@nestjs/microservices';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import {
  EventDidcommConnectionsCreateInvitation,
  EventDidcommConnectionsReceiveInvitationFromUrl,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { InvitationsService } from '../invitations.service.js';

describe('InvitationsService', () => {
  let service: InvitationsService;
  let natsClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: NATS_CLIENT,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
    natsClient = module.get<ClientProxy>(NATS_CLIENT);
  });

  describe('createInvitation', () => {
    it('should return an invitation', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const expectedResult: EventDidcommConnectionsCreateInvitation['data'] = {
        invitationUrl: 'https://example.com/invitation',
      };

      jest
        .spyOn(natsClient, 'send')
        .mockReturnValue(
          of(
            new EventDidcommConnectionsCreateInvitation(
              expectedResult,
              tenantId,
            ),
          ),
        );

      service
        .createInvitation(tenantId)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClient.send).toHaveBeenCalledWith(
            EventDidcommConnectionsCreateInvitation.token,
            { tenantId },
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('receiveInvitationFromURL', () => {
    it('should return a connection', (done) => {
      const unsubscribe$ = new Subject<void>();
      const tenantId = 'exampleTenantId';
      const invitationUrl = 'https://example.com/invitation';
      const expectedResult =
        {} as EventDidcommConnectionsReceiveInvitationFromUrl['data'];

      jest
        .spyOn(natsClient, 'send')
        .mockReturnValue(
          of(
            new EventDidcommConnectionsReceiveInvitationFromUrl(
              expectedResult,
              tenantId,
            ),
          ),
        );

      service
        .receiveInvitationFromURL(tenantId, invitationUrl)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClient.send).toHaveBeenCalledWith(
            EventDidcommConnectionsReceiveInvitationFromUrl.token,
            { tenantId, invitationUrl },
          );
          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
