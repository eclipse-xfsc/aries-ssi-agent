import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseFormatInterceptor } from '@ocm/shared';

import { CreateTenantPayload } from './dto/create-tenant.dto.js';
import { TenantsService } from './tenants.service.js';

@Controller()
@ApiTags('Tenants')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(new ResponseFormatInterceptor())
export class TenantsController {
  public constructor(private readonly service: TenantsService) {}

  @Get()
  public find() {
    return this.service.find();
  }

  @Post()
  public create(@Body() payload: CreateTenantPayload) {
    return this.service.create(payload.label);
  }
}
