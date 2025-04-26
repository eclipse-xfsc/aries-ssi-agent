import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCredentialDefinitionPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public issuerDid: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public schemaId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public tag: string;

  @IsBoolean()
  @ApiProperty()
  public supportsRevocation: boolean;
}
