import type {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultitenancyParams, ResponseFormatInterceptor } from '@ocm/shared';
import { Observable, of, switchMap } from 'rxjs';

import { GetByIdParams } from './dto/get-by-id.dto.js';
import { RegisterSchemaPayload } from './dto/register-schema.dto.js';
import { SchemasService } from './schemas.service.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Schemas')
export class SchemasController {
  public constructor(private readonly schemasService: SchemasService) {}

  @Version('1')
  @Get()
  @ApiOperation({
    summary: 'Fetch a list of schemas',
    description: 'This call provides a list of schemas for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schemas fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schemas fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Schemas fetched successfully',
              data: [],
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
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public getAll(
    @Query() { tenantId }: MultitenancyParams,
  ): Observable<EventAnonCredsSchemasGetAll['data']> {
    return this.schemasService.getAll(tenantId);
  }

  @Version('1')
  @Get(':schemaId')
  @ApiOperation({
    summary: 'Fetch a schema by id',
    description:
      'This call allows you to retrieve schema data for a given tenant by specifying the `schemaId`.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schema fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Schema fetched successfully',
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
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schema not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema not found': {
            value: {
              statusCode: 404,
              message: 'Schema not found',
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
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public getById(
    @Param() { schemaId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ): Observable<EventAnonCredsSchemasGetById['data']> {
    return this.schemasService.getById(tenantId, schemaId).pipe(
      switchMap((schema) => {
        if (schema === null) {
          throw new NotFoundException(`Schema with id ${schemaId} not found`);
        }
        return of(schema);
      }),
    );
  }

  @Version('1')
  @Post()
  @ApiOperation({
    summary: 'Register a new schema',
    description:
      'This call provides the capability to create new schema on ledger by name, author, version, schema attributes and type. Later this schema can be used to issue new credential definition. This call returns an information about created schema.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Schema registered successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema registered successfully': {
            value: {
              statusCode: 201,
              message: 'Schema registered successfully',
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
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'All fields are required for schema registration',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'All fields are required for schema registration': {
            value: {
              statusCode: 400,
              message: 'All fields are required for schema registration',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Schema already exists',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Schema already exists': {
            value: {
              statusCode: 409,
              message: 'Schema already exists',
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
    @Body() payload: RegisterSchemaPayload,
  ): Observable<EventAnonCredsSchemasRegister['data']> {
    return this.schemasService.register(tenantId, payload);
  }
}
