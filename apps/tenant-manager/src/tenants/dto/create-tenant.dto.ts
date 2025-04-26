import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTenantPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The label of the tenant',
    example: 'Alice',
  })
  public label: string;
}
