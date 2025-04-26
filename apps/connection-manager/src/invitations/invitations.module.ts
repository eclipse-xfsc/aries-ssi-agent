import { Module } from '@nestjs/common';

import { InvitationsController } from './invitations.controller.js';
import { InvitationsService } from './invitations.service.js';

@Module({
  providers: [InvitationsService],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
