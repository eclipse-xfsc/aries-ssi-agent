import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ResolveParams {
  @IsString()
  @Matches(/^did:[a-z0-9]+:.+$/)
  @ApiProperty({
    description: 'DID to resolve',
    example: 'did:example:123',
  })
  public did: string;
}
