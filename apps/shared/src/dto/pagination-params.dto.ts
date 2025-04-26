import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParams {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Specifies the page number of a result set',
  })
  public page?: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'Specifies the number of items to return in a single page of a result set',
  })
  public pageSize?: number;
}
