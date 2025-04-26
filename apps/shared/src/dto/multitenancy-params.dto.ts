import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MultitenancyParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Specifies the tenant ID',
  })
  public tenantId: string;
}
