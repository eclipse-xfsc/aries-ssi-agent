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

import { CredentialOffersService } from './credential-offers.service.js';
import { GetByIdParams } from './dto/get-by-id.dto.js';
import { OfferPayload, OfferPayloadSelf } from './dto/offer.dto.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Credential Offers')
export class CredentialOffersController {
  public constructor(private readonly service: CredentialOffersService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch a list of credential offers',
    description:
      'This call provides a list of credential offers for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential offers fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential offers fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential offers fetched successfully',
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
  public find(@Query() { tenantId }: MultitenancyParams) {
    return this.service.findCredentialOffers(tenantId);
  }

  @Get(':credentialOfferId')
  @ApiOperation({
    summary: 'Fetch a credential offer by ID',
    description: 'This call provides a credential offer for a given ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential offer fetched successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential offer fetched successfully': {
            value: {
              statusCode: 200,
              message: 'Credential offer fetched successfully',
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
          'Credential offer not found': {
            value: {
              statusCode: 404,
              message: 'Credential offer not found',
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
  public getById(
    @Param() { credentialOfferId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ) {
    return this.service.getCredentialOfferById(tenantId, credentialOfferId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a credential offer',
    description:
      'This call creates a credential offer for a given connection ID and credential definition ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential offer created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential offer created successfully': {
            value: {
              statusCode: 200,
              message: 'Credential offer created successfully',
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
          'Credential offer not found': {
            value: {
              statusCode: 404,
              message: 'Credential offer not found',
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
          'Credential definition not found': {
            value: {
              statusCode: 404,
              message: 'Credential definition not found',
              data: null,
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
  public offer(
    @Query() { tenantId }: MultitenancyParams,
    @Body()
    {
      connectionId,
      credentialDefinitionId,
      attributes,
      revocationRegistryDefinitionId,
    }: OfferPayload,
  ) {
    return this.service.offer(
      tenantId,
      connectionId,
      credentialDefinitionId,
      attributes,
      revocationRegistryDefinitionId,
    );
  }

  @Post('self')
  @ApiOperation({
    summary: 'Create a credential offer to self',
    description:
      'This call creates a credential offer for a given credential definition ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential offer created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential offer created successfully': {
            value: {
              statusCode: 200,
              message: 'Credential offer created successfully',
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
          'Credential offer not found': {
            value: {
              statusCode: 404,
              message: 'Credential offer not found',
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
          'Credential definition not found': {
            value: {
              statusCode: 404,
              message: 'Credential definition not found',
              data: null,
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
  public offerToSelf(
    @Query() { tenantId }: MultitenancyParams,
    @Body()
    { credentialDefinitionId, attributes }: OfferPayloadSelf,
  ) {
    return this.service.offerToSelf(
      tenantId,
      credentialDefinitionId,
      attributes,
    );
  }

  @Post(':credentialOfferId/accept')
  @ApiOperation({
    summary: 'Accept a credential offer',
    description: 'This call accepts a credential offer for a given ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential offer accepted successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Credential offer accepted successfully': {
            value: {
              statusCode: 200,
              message: 'Credential offer accepted successfully',
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
          'Credential offer not found': {
            value: {
              statusCode: 404,
              message: 'Credential offer not found',
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
  public acceptOffer(
    @Param() { credentialOfferId }: GetByIdParams,
    @Query() { tenantId }: MultitenancyParams,
  ) {
    return this.service.acceptOffer(tenantId, credentialOfferId);
  }
}
