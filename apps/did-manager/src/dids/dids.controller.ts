import {
  Body,
  Controller,
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

import { DIDsService } from './dids.service.js';
import { GetConfigurationPayload } from './dto/get-configuration.dto.js';
import { RegisterFromSeedPayload } from './dto/register-from-seed.dto.js';
import { ResolveParams } from './dto/resolve.dto.js';

@Controller()
@ApiTags('DIDs')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(new ResponseFormatInterceptor())
export class DIDsController {
  public constructor(private readonly service: DIDsService) {}

  @Get(':did')
  @ApiOperation({
    summary: 'Resolve DID',
    description: 'Resolve DID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'DID resolved successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'DID resolved successfully': {
            value: {
              statusCode: 200,
              message: 'DID resolved successfully',
              data: {},
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'DID not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Tenant not found': {
            value: {
              statusCode: 404,
              message: 'Tenant not found',
            },
          },
          'DID not found': {
            value: {
              statusCode: 404,
              message: 'DID not found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid DID',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid DID': {
            value: {
              statusCode: 400,
              message: 'Invalid DID',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Something went wrong': {
            value: {
              statusCode: 500,
              message: 'Something went wrong',
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public resolve(
    @Query() { tenantId }: MultitenancyParams,
    @Param() { did }: ResolveParams,
  ) {
    return this.service.resolve(tenantId, did);
  }

  @Post()
  @ApiOperation({
    summary: 'Register DID from seed',
    description: 'Register DID from seed',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'DID registered successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'DID registered successfully': {
            value: {
              statusCode: 200,
              message: 'DID registered successfully',
              data: {},
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid seed',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid seed': {
            value: {
              statusCode: 400,
              message: 'Invalid seed',
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
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Something went wrong': {
            value: {
              statusCode: 500,
              message: 'Something went wrong',
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public registerFromSeed(
    @Query() { tenantId }: MultitenancyParams,
    @Body() { seed, services }: RegisterFromSeedPayload,
  ) {
    return this.service.registerFromSeed(tenantId, seed, services);
  }

  @Post('configuration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get DID configuration',
    description: 'Get DID configuration',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'DID configuration fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'DID configuration fetched successfully': {
            value: {
              statusCode: 200,
              message: 'DID configuration fetched successfully',
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
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Something went wrong': {
            value: {
              statusCode: 500,
              message: 'Something went wrong',
              error: 'Internal Server Error',
            },
          },
        },
      },
    },
  })
  public getConfiguration(
    @Query() { tenantId }: MultitenancyParams,
    @Body() { domain, expiryTime }: GetConfigurationPayload,
  ) {
    return this.service.getConfiguration(tenantId, domain, expiryTime);
  }
}
