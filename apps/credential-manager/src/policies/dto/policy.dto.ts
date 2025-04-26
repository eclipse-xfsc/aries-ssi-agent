import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PolicyParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The credential ID to check the policy for',
  })
  public credentialId: string;
}
