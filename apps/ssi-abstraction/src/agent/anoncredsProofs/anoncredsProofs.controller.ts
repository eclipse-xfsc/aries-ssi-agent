import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventAnonCredsProofsDeleteById,
  EventAnonCredsProofsDeleteByIdInput,
  EventAnonCredsProofsGetAll,
  EventAnonCredsProofsGetAllInput,
  EventAnonCredsProofsGetById,
  EventAnonCredsProofsGetByIdInput,
  EventDidcommAnonCredsProofsAcceptRequest,
  EventDidcommAnonCredsProofsAcceptRequestInput,
  EventDidcommAnonCredsProofsRequest,
  EventDidcommAnonCredsProofsRequestInput,
} from '@ocm/shared';

import { AnonCredsProofsService } from './anoncredsProofs.service.js';

@Controller('anoncredsProofs')
export class AnonCredsProofsController {
  public constructor(private proofsService: AnonCredsProofsService) {}

  @MessagePattern(EventAnonCredsProofsGetAll.token)
  public async getAll(
    options: EventAnonCredsProofsGetAllInput,
  ): Promise<EventAnonCredsProofsGetAll> {
    return new EventAnonCredsProofsGetAll(
      await this.proofsService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsProofsGetById.token)
  public async getById(
    options: EventAnonCredsProofsGetByIdInput,
  ): Promise<EventAnonCredsProofsGetById> {
    return new EventAnonCredsProofsGetById(
      await this.proofsService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsProofsDeleteById.token)
  public async deleteById(
    options: EventAnonCredsProofsDeleteByIdInput,
  ): Promise<EventAnonCredsProofsDeleteById> {
    return new EventAnonCredsProofsDeleteById(
      await this.proofsService.deleteById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsProofsRequest.token)
  public async request(
    options: EventDidcommAnonCredsProofsRequestInput,
  ): Promise<EventDidcommAnonCredsProofsRequest> {
    return new EventDidcommAnonCredsProofsRequest(
      await this.proofsService.request(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventDidcommAnonCredsProofsAcceptRequest.token)
  public async accept(
    options: EventDidcommAnonCredsProofsAcceptRequestInput,
  ): Promise<EventDidcommAnonCredsProofsAcceptRequest> {
    return new EventDidcommAnonCredsProofsAcceptRequest(
      await this.proofsService.accept(options),
      options.tenantId,
    );
  }
}
