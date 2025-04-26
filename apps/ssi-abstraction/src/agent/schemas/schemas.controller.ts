import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegister,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { SchemasService } from './schemas.service.js';

@Controller('schemas')
export class SchemasController {
  public constructor(private schemasService: SchemasService) {}

  @MessagePattern(EventAnonCredsSchemasGetAll.token)
  public async getAll(
    options: EventAnonCredsSchemasGetAllInput,
  ): Promise<EventAnonCredsSchemasGetAll> {
    return new EventAnonCredsSchemasGetAll(
      await this.schemasService.getAll(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsSchemasGetById.token)
  public async getById(
    options: EventAnonCredsSchemasGetByIdInput,
  ): Promise<EventAnonCredsSchemasGetById> {
    return new EventAnonCredsSchemasGetById(
      await this.schemasService.getById(options),
      options.tenantId,
    );
  }

  @MessagePattern(EventAnonCredsSchemasRegister.token)
  public async register(
    options: EventAnonCredsSchemasRegisterInput,
  ): Promise<EventAnonCredsSchemasRegister> {
    return new EventAnonCredsSchemasRegister(
      await this.schemasService.register(options),
      options.tenantId,
    );
  }
}
