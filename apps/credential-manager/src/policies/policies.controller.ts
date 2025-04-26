import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultitenancyParams, ResponseFormatInterceptor } from '@ocm/shared';

import { PolicyParams } from './dto/policy.dto.js';
import { PoliciesService } from './policies.service.js';

@Controller()
@ApiTags('Policies')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(new ResponseFormatInterceptor())
export class PoliciesController {
  public constructor(private readonly service: PoliciesService) {}

  @Post('check-reissue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check if a credential can be reissued',
    description: 'Check if a credential can be reissued',
  })
  @ApiResponse({
    status: 200,
    description: 'The result of the policy evaluation',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            result: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
            },
          },
          'Credential not found': {
            value: {
              statusCode: 404,
              message: 'Credential not found',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal server error': {
            value: {
              statusCode: 500,
              message: 'Internal server error',
              data: null,
            },
          },
        },
      },
    },
  })
  public async checkAutoReissue(
    @Query() { tenantId }: MultitenancyParams,
    @Body() { credentialId }: PolicyParams,
  ) {
    return this.service.checkAutoReissue(tenantId, credentialId);
  }

  @Post('check-revocation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check if a credential should be revoked',
    description: 'Check if a credential should be revoked',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The result of the policy evaluation',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            result: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
            },
          },
          'Credential not found': {
            value: {
              statusCode: 404,
              message: 'Credential not found',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal server error': {
            value: {
              statusCode: 500,
              message: 'Internal server error',
              data: null,
            },
          },
        },
      },
    },
  })
  public checkAutoRevocation(
    @Query() { tenantId }: MultitenancyParams,
    @Body() { credentialId }: PolicyParams,
  ) {
    return this.service.checkAutoRevocation(tenantId, credentialId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check if a credential should be refreshed',
    description: 'Check if a credential should be refreshed',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The result of the policy evaluation',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            result: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
            },
          },
          'Credential not found': {
            value: {
              statusCode: 404,
              message: 'Credential not found',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Internal server error': {
            value: {
              statusCode: 500,
              message: 'Internal server error',
              data: null,
            },
          },
        },
      },
    },
  })
  public checkRefresh(
    @Query() { tenantId }: MultitenancyParams,
    @Body() { credentialId }: PolicyParams,
  ) {
    return this.service.checkRefresh(tenantId, credentialId);
  }
}
