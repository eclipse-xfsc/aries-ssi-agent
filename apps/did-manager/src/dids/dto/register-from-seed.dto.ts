import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Service {
  @IsString()
  @ApiProperty({
    description: 'Service identifier',
    example: 'did:example:123#linked-domain',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Service Type',
    example: 'LinkedDomains',
  })
  public type: string;

  @IsString()
  @ApiProperty({
    description: 'Service Endpoint',
    example: 'https://bar.example.com',
  })
  public serviceEndpoint: string;
}

export class RegisterFromSeedPayload {
  @IsString()
  @ApiProperty({
    description: 'Seed to use for DID generation',
    example: '000000000000000000000000Steward1',
  })
  public seed: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Service)
  @IsOptional()
  @ApiProperty({
    description: 'Services to associate with DID',
    example: [
      {
        identifier: 'example',
        url: 'https://example.com',
        type: 'example',
      },
    ],
  })
  public services?: Service[];
}
