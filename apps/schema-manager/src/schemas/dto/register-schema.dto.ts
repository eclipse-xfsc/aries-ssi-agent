import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class RegisterSchemaPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public issuerDid: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @IsSemVer()
  @ApiProperty()
  public version: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty()
  public attributeNames: Array<string>;
}
