import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The credential offer ID to retrieve',
    format: 'string',
  })
  public credentialOfferId: string;
}
