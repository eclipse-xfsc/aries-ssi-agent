import {
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

import { ConnectionsService } from './connections.service.js';
import { BlockParams } from './dto/block.dto.js';
import { GetByIdParams } from './dto/get-by-id.dto.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Connections')
export class ConnectionsController {
  public constructor(private readonly service: ConnectionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch a list of connections',
    description: 'This call provides a list of connections for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connections fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connections fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Connections fetched successfully',
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
              data: null,
            },
          },
        },
      },
    },
  })
  public getAll(
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ConnectionsService['getAllConnections']> {
    return this.service.getAllConnections(tenantId);
  }

  @Get(':connectionId')
  @ApiOperation({
    summary: 'Fetch a connection by ID',
    description:
      'This call provides a connection for a given tenant and connection ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connection fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Connection fetched successfully',
              data: {},
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Connection not found',
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
          'Connection not found': {
            value: {
              statusCode: 404,
              message: 'Connection not found',
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
    @Param() { connectionId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ConnectionsService['getConnectionById']> {
    return this.service.getConnectionById(tenantId, connectionId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a connection',
    description: 'This call creates a self connection for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Connection created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection created successfully': {
            value: {
              statusCode: 201,
              message: 'Connection created successfully',
              data: {},
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
              data: null,
            },
          },
        },
      },
    },
  })
  public createWithSelf(
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ConnectionsService['createConnectionWithSelf']> {
    return this.service.createConnectionWithSelf(tenantId);
  }

  @Post(':idOrDid/block')
  @ApiOperation({
    summary: 'Block a connection',
    description:
      'This call blocks a connection for a given tenant and connection ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Connection blocked successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Connection blocked successfully': {
            value: {
              statusCode: 200,
              message: 'Connection blocked successfully',
              data: {},
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Connection not found',
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
          'Connection not found': {
            value: {
              statusCode: 404,
              message: 'Connection not found',
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
  public block(
    @Param() { idOrDid }: BlockParams,
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ConnectionsService['blockConnection']> {
    return this.service.blockConnection(tenantId, idOrDid);
  }
}
