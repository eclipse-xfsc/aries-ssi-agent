import { IsNumber, IsString } from 'class-validator';

export class GetConfigurationPayload {
  @IsString()
  public domain: string;

  @IsNumber()
  public expiryTime: number;
}
