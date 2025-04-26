import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultitenancyParams, ResponseFormatInterceptor } from '@ocm/shared';
import { of, switchMap } from 'rxjs';

import { GetByIdParams } from './dto/get-by-id.dto.js';
import { RequestPayload } from './dto/request.dto.js';
import { ProofsService } from './proofs.service.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Presentation Proofs')
export class ProofsController {
  public constructor(private readonly service: ProofsService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch a list of presentation proofs',
    description:
      'This call provides a list of presentation proofs for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Presentation proofs fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation proofs fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Presentation proofs fetched successfully',
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
  public find(
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ProofsService['find']> {
    return this.service.find(tenantId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetch a presentation proof by id',
    description:
      'This call provides a presentation proof for a given tenant and id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Presentation proof fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation proof fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Presentation proof fetched successfully',
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid presentation proof id',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid presentation proof id': {
            value: {
              statusCode: 400,
              message: 'Invalid presentation proof id',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Presentation proof not found',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation proof not found': {
            value: {
              statusCode: 404,
              message: 'Presentation proof not found',
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
  public get(
    @Param() { proofRecordId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ProofsService['getById']> {
    return this.service.getById(tenantId, proofRecordId).pipe(
      switchMap((proofRecord) => {
        if (!proofRecord) {
          throw new NotFoundException(
            `Presentation proof with id ${proofRecordId} not found`,
          );
        }

        return of(proofRecord);
      }),
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Request a presentation proof',
    description: 'This call requests a presentation proof for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Presentation proof requested successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation proof requested successfully': {
            value: {
              statusCode: 201,
              message: 'Presentation proof requested successfully',
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request payload',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid request payload': {
            value: {
              statusCode: 400,
              message: 'Invalid request payload',
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Proof of Vaccination',
        },
        connectionId: {
          type: 'string',
          example: '1234567890',
        },
        requestedAttributes: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              names: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              restrictions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    schema_id: { type: 'string' },
                    schema_issuer_id: { type: 'string' },
                    schema_name: { type: 'string' },
                    schema_version: { type: 'string' },
                    issuer_id: { type: 'string' },
                    cred_def_id: { type: 'string' },
                    rev_reg_id: { type: 'string' },
                    schema_issuer_did: { type: 'string' },
                    issuer_did: { type: 'string' },
                  },
                  patternProperties: {
                    '^attr::.*?::marker$': { enum: ['1', '0'] },
                    '^attr::.*?::value$': { type: 'string' },
                  },
                  additionalProperties: {
                    type: 'string',
                    anyOf: [{ enum: ['1', '0'] }, { type: 'string' }],
                  },
                },
              },
            },
            required: ['names'],
          },
        },
        requestedPredicates: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            predicateType: { enum: ['>=', '>', '<=', '<'] },
            predicateValue: { type: 'number' },
            restrictions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  schema_id: { type: 'string' },
                  schema_issuer_id: { type: 'string' },
                  schema_name: { type: 'string' },
                  schema_version: { type: 'string' },
                  issuer_id: { type: 'string' },
                  cred_def_id: { type: 'string' },
                  rev_reg_id: { type: 'string' },
                  schema_issuer_did: { type: 'string' },
                  issuer_did: { type: 'string' },
                },
                patternProperties: {
                  '^attr::.*?::marker$': { enum: ['1', '0'] },
                  '^attr::.*?::value$': { type: 'string' },
                },
                additionalProperties: {
                  type: 'string',
                  anyOf: [{ enum: ['1', '0'] }, { type: 'string' }],
                },
              },
            },
          },
          required: ['name', 'predicateType', 'predicateValue'],
        },
      },
      required: [
        'name',
        'connectionId',
        'requestedAttributes',
        'requestedPredicates',
      ],
    },
  })
  public request(
    @Query() { tenantId }: MultitenancyParams,
    @Body()
    {
      name,
      connectionId,
      requestedAttributes,
      requestedPredicates,
    }: RequestPayload,
  ): ReturnType<ProofsService['request']> {
    return this.service.request(
      tenantId,
      name,
      connectionId,
      requestedAttributes,
      requestedPredicates,
    );
  }

  @Post(':proofRecordId/accept')
  @HttpCode(HttpStatus.OK)
  public accept(
    @Query() { tenantId }: MultitenancyParams,
    @Param() { proofRecordId }: GetByIdParams,
  ) {
    return this.service.accept(tenantId, proofRecordId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a presentation proof',
    description: 'This call deletes a presentation proof for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Presentation proof deleted successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Presentation proof deleted successfully': {
            value: {
              statusCode: 200,
              message: 'Presentation proof deleted successfully',
              data: null,
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
          'Presentation proof not found': {
            value: {
              statusCode: 404,
              message: 'Presentation proof not found',
              data: null,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid presentation proof id',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invalid presentation proof id': {
            value: {
              statusCode: 400,
              message: 'Invalid presentation proof id',
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
  public delete(
    @Param() { proofRecordId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<ProofsService['delete']> {
    return this.service.delete(tenantId, proofRecordId);
  }
}
