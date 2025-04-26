import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The connection ID',
    example: '71b784a3',
  })
  public connectionId: string;
}
