import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventDidcommConnectionsGetById,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsGetAllInput,
  EventDidcommConnectionsGetByIdInput,
  EventDidcommConnectionsCreateWithSelfInput,
  EventDidcommConnectionsBlockInput,
  EventDidcommConnectionsCreateInvitation,
  EventDidcommConnectionsCreateInvitationInput,
  EventDidcommConnectionsReceiveInvitationFromUrl,
  EventDidcommConnectionsReceiveInvitationFromUrlInput,
  EventDidcommConnectionsParseInvitation,
  EventDidcommConnectionsParseInvitationInput,
} from '@ocm/shared';

import { ConnectionsService } from './connections.service.js';

@Controller('connections')
export class ConnectionsController {
  public constructor(private connectionsService: ConnectionsService) {}

  @MessagePattern(EventDidcommConnectionsGetAll.token)
  public async getAll(
    options: EventDidcommConnectionsGetAllInput,
  ): Promise<EventDidcommConnectionsGetAll> {
    return new EventDidcommConnectionsGetAll(
      await this.connectionsService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsGetById.token)
  public async getById(
    options: EventDidcommConnectionsGetByIdInput,
  ): Promise<EventDidcommConnectionsGetById> {
    return new EventDidcommConnectionsGetById(
      await this.connectionsService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsCreateInvitation.token)
  public async createInvitation(
    options: EventDidcommConnectionsCreateInvitationInput,
  ): Promise<EventDidcommConnectionsCreateInvitation> {
    return new EventDidcommConnectionsCreateInvitation(
      await this.connectionsService.createInvitation(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsReceiveInvitationFromUrl.token)
  public async receiveInvitationFromUrl(
    options: EventDidcommConnectionsReceiveInvitationFromUrlInput,
  ): Promise<EventDidcommConnectionsReceiveInvitationFromUrl> {
    return new EventDidcommConnectionsReceiveInvitationFromUrl(
      await this.connectionsService.receiveInvitationFromUrl(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsCreateWithSelf.token)
  public async createConnectionWithSelf(
    options: EventDidcommConnectionsCreateWithSelfInput,
  ): Promise<EventDidcommConnectionsCreateWithSelf> {
    return new EventDidcommConnectionsCreateWithSelf(
      await this.connectionsService.createConnectionWithSelf(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsBlock.token)
  public async blockConnection(
    options: EventDidcommConnectionsBlockInput,
  ): Promise<EventDidcommConnectionsBlock> {
    return new EventDidcommConnectionsBlock(
      await this.connectionsService.blockByIdOrDid(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommConnectionsParseInvitation.token)
  public async parseInvitation(
    options: EventDidcommConnectionsParseInvitationInput,
  ): Promise<EventDidcommConnectionsParseInvitation> {
    return new EventDidcommConnectionsParseInvitation(
      await this.connectionsService.parseInvitation(options),
      options.tenantId,
    );
  }
}
