import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultitenancyParams, ResponseFormatInterceptor } from '@ocm/shared';

import { CredentialRequestsService } from './credential-requests.service.js';
import { GetByIdParams } from './dto/get-by-id.dto.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Credential Requests')
export class CredentialRequestsController {
  public constructor(private readonly service: CredentialRequestsService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch a list of credential requests',
    description:
      'This call provides a list of credential requests for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential requests fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential requests fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential requests fetched successfully',
              data: [
                {
                  id: '71b784a3',
                },
              ],
            },
          },
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
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
          'Credential request not found': {
            value: {
              statusCode: 404,
              message: 'Credential request not found',
              data: null,
            },
          },
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
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
  public find(@Query() { tenantId }: MultitenancyParams) {
    return this.service.findCredentialRequests(tenantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetch a credential request by id',
    description:
      'This call provides a credential request for a given tenant by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential request fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential request fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential request fetched successfully',
              data: {
                id: '71b784a3',
              },
            },
          },
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
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
          'Credential request not found': {
            value: {
              statusCode: 404,
              message: 'Credential request not found',
              data: null,
            },
          },
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
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
  public getById(
    @Param() { credentialRequestId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ) {
    return this.service.getCredentialRequestById(tenantId, credentialRequestId);
  }
}
