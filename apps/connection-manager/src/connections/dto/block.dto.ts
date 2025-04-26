import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BlockParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The connection ID or DID',
    example: '8d74c6ec-fa3e-4a09-91fb-5fd0062da835',
  })
  public idOrDid: string;
}
