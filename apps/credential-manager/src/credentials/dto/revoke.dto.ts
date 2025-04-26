import { IsNotEmpty, IsString } from 'class-validator';

export class RevokeParams {
  @IsString()
  @IsNotEmpty()
  public credentialId: string;
}
