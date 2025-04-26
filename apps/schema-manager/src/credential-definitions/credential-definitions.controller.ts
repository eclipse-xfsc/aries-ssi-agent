import {
  Body,
  Controller,
  Get,
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

import { CredentialDefinitionsService } from './credential-definitions.service.js';
import { CreateCredentialDefinitionPayload } from './dto/create-credential-definition.dto.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Credential Definitions')
export class CredentialDefinitionsController {
  public constructor(private readonly service: CredentialDefinitionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch a list of credential definitions',
    description:
      'This call provides a list of credential definitions for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential definitions fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definitions fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential definitions fetched successfully',
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
    description: 'Tenant not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              error: 'Not Found',
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
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public find(
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<CredentialDefinitionsService['findCredentialDefinitions']> {
    return this.service.findCredentialDefinitions(tenantId);
  }

  @Get(':credentialDefinitionId')
  @ApiOperation({
    summary: 'Fetch a credential definition by ID',
    description:
      'This call provides a credential definition for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential definition fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential definition fetched successfully',
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
    description: 'Credential definition not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition not found': {
            value: {
              statusCode: 404,
              message: 'Credential definition not found',
              error: 'Not Found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              error: 'Not Found',
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
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public get(
    @Query() { tenantId }: MultitenancyParams,
    @Param('credentialDefinitionId') credentialDefinitionId: string,
  ): ReturnType<CredentialDefinitionsService['getCredentialDefinitionById']> {
    return this.service.getCredentialDefinitionById(
      tenantId,
      credentialDefinitionId,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create a credential definition',
    description:
      'This call allows you to create a credential definition for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential definition created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition created successfully': {
            value: {
              statusCode: 201,
              message: 'Credential definition created successfully',
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
    description: 'Tenant not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
              error: 'Not Found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid request': {
            value: {
              statusCode: 400,
              message: 'Invalid request',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Credential definition already exists',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential definition already exists': {
            value: {
              statusCode: 409,
              message: 'Credential definition already exists',
              error: 'Conflict',
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
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public register(
    @Query() { tenantId }: MultitenancyParams,
    @Body() payload: CreateCredentialDefinitionPayload,
  ): ReturnType<CredentialDefinitionsService['registerCredentialDefinition']> {
    return this.service.registerCredentialDefinition(tenantId, payload);
  }
}
