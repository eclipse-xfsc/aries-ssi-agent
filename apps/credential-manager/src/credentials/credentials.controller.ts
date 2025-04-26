import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultitenancyParams, ResponseFormatInterceptor } from '@ocm/shared';

import { CredentialsService } from './credentials.service.js';
import { DeleteParams } from './dto/delete.dto.js';
import { GetParams } from './dto/get.dto.js';
import { RevokeParams } from './dto/revoke.dto.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Credentials')
export class CredentialsController {
  public constructor(private readonly service: CredentialsService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch a list of credentials',
    description: 'This call provides a list of credentials for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credentials fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credentials fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credentials fetched successfully',
              data: [
                {
                  id: '71b784a3',
                },
              ],
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
  public find(@Query() { tenantId }: MultitenancyParams) {
    return this.service.find(tenantId);
  }

  @Get(':credentialRecordId')
  @ApiOperation({
    summary: 'Fetch a credential',
    description: 'This call provides a credential for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential fetched successfully',
              data: {
                id: '71b784a3',
              },
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
          'Credential not found': {
            value: {
              statusCode: 404,
              message: 'Credential not found',
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
  public get(
    @Param() { credentialRecordId }: GetParams,
    @Query() { tenantId }: MultitenancyParams,
  ) {
    return this.service.get(tenantId, credentialRecordId);
  }

  @Post(':credentialId/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revoke a credential',
    description: 'This call revokes a credential for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential revoked successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential revoked successfully': {
            value: {
              statusCode: 200,
              message: 'Credential revoked successfully',
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
          'Credential not found': {
            value: {
              statusCode: 404,
              message: 'Credential not found',
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
  public revoke(
    @Query() { tenantId }: MultitenancyParams,
    @Param() { credentialId }: RevokeParams,
  ) {
    return this.service.revoke(tenantId, credentialId);
  }

  @Delete(':credentialId')
  @ApiOperation({
    summary: 'Delete a credential',
    description: 'This call deletes a credential for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential deleted successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential deleted successfully': {
            value: {
              statusCode: 200,
              message: 'Credential deleted successfully',
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
          'Credential not found': {
            value: {
              statusCode: 404,
              message: 'Credential not found',
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
  public delete(
    @Param() { credentialRecordId }: DeleteParams,
    @Query() { tenantId }: MultitenancyParams,
  ) {
    return this.service.delete(tenantId, credentialRecordId);
  }
}
