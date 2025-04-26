import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Attribute {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public value: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public mimeType?: string;
}

export class OfferPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public connectionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public credentialDefinitionId: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Attribute)
  @ApiProperty({ type: [Attribute] })
  public attributes: Attribute[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public revocationRegistryDefinitionId?: string;
}

export class OfferPayloadSelf {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public credentialDefinitionId: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Attribute)
  @ApiProperty({ type: [Attribute] })
  public attributes: Attribute[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public revocationRegistryDefinitionId?: string;
}
