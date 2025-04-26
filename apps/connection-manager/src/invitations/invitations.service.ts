import type {
  EventDidcommConnectionsCreateInvitationInput,
  EventDidcommConnectionsReceiveInvitationFromUrlInput,
} from '@ocm/shared';
import type { Observable } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventDidcommConnectionsCreateInvitation,
  EventDidcommConnectionsReceiveInvitationFromUrl,
} from '@ocm/shared';
import { map } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public createInvitation(
    tenantId: string,
  ): Observable<EventDidcommConnectionsCreateInvitation['data']> {
    this.logger.log({
      message: 'Create an invitation',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventDidcommConnectionsCreateInvitation,
        EventDidcommConnectionsCreateInvitationInput
      >(EventDidcommConnectionsCreateInvitation.token, { tenantId })
      .pipe(map(({ data }) => data));
  }

  public receiveInvitationFromURL(
    tenantId: string,
    invitationUrl: string,
  ): Observable<EventDidcommConnectionsReceiveInvitationFromUrl['data']> {
    this.logger.log({
      message: 'Receive an invitation from URL',
      labels: { tenantId },
      'ocm.invitations.invitationUrl': invitationUrl,
    });
    return this.natsClient
      .send<
        EventDidcommConnectionsReceiveInvitationFromUrl,
        EventDidcommConnectionsReceiveInvitationFromUrlInput
      >(EventDidcommConnectionsReceiveInvitationFromUrl.token, {
        tenantId,
        invitationUrl,
      })
      .pipe(map(({ data }) => data));
  }
}
