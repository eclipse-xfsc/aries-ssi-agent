import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultitenancyParams, ResponseFormatInterceptor } from '@ocm/shared';

import { ReceiveInvitationPayload } from './dto/receive-invitation.dto.js';
import { InvitationsService } from './invitations.service.js';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseInterceptors(ResponseFormatInterceptor)
@ApiTags('Invitations')
export class InvitationsController {
  public constructor(private readonly service: InvitationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new invitation',
    description: 'This call creates a new invitation for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation created successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invitation created successfully': {
            value: {
              statusCode: 200,
              message: 'Invitation created successfully',
              data: {
                invitationUrl: 'https://example.com/invitation',
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to create invitation',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Failed to create invitation': {
            value: {
              statusCode: 500,
              message: 'Failed to create invitation',
              data: null,
            },
          },
        },
      },
    },
  })
  public createInvitation(
    @Query() { tenantId }: MultitenancyParams,
  ): ReturnType<InvitationsService['createInvitation']> {
    return this.service.createInvitation(tenantId);
  }

  @Post('receive')
  @ApiOperation({
    summary: 'Receive an invitation',
    description: 'This call receives an invitation for a given tenant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invitation received successfully',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Invitation received successfully': {
            value: {
              statusCode: 200,
              message: 'Invitation received successfully',
              data: {
                connectionId: '123',
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to receive invitation',
    content: {
      'application/json': {
        schema: {},
        examples: {
          'Failed to receive invitation': {
            value: {
              statusCode: 500,
              message: 'Failed to receive invitation',
              data: null,
            },
          },
        },
      },
    },
  })
  public receiveInvitation(
    @Query() { tenantId }: MultitenancyParams,
    @Body() { invitationUrl }: ReceiveInvitationPayload,
  ): ReturnType<InvitationsService['receiveInvitationFromURL']> {
    return this.service.receiveInvitationFromURL(tenantId, invitationUrl);
  }
}
