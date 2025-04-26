import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The credential record ID to retrieve',
    format: 'string',
  })
  public credentialRecordId: string;
}
