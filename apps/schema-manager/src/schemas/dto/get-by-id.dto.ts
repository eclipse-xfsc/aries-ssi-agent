import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The schema ID to retrieve', format: 'string' })
  public schemaId: string;
}
