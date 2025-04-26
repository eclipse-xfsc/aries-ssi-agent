import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The credential record ID to delete',
    format: 'string',
  })
  public credentialRecordId: string;
}
