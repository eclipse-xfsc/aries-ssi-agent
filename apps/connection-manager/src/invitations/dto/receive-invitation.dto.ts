import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ReceiveInvitationPayload {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  @ApiProperty({
    description: 'The invitation URL to receive',
    example: 'https://example.com/invitation',
  })
  public invitationUrl: string;
}
