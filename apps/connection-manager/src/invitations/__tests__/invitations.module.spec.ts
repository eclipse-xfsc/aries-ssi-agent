import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { InvitationsController } from '../invitations.controller.js';
import { InvitationsModule } from '../invitations.module.js';
import { InvitationsService } from '../invitations.service.js';

describe('InvitationsModule', () => {
  let invitationsService: InvitationsService;
  let invitationsController: InvitationsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        InvitationsModule,
      ],
    }).compile();

    invitationsService = moduleRef.get<InvitationsService>(InvitationsService);
    invitationsController = moduleRef.get<InvitationsController>(
      InvitationsController,
    );
  });

  it('should be defined', () => {
    expect(invitationsService).toBeDefined();
    expect(invitationsService).toBeInstanceOf(InvitationsService);

    expect(invitationsController).toBeDefined();
    expect(invitationsController).toBeInstanceOf(InvitationsController);
  });
});
