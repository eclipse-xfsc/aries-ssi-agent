import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdParams {
  @IsString()
  @IsNotEmpty()
  public readonly proofRecordId: string;
}
