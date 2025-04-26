import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RequestPayload {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  public readonly connectionId: string;

  @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => RequestedAttribute)
  public readonly requestedAttributes: Record<string, RequestedAttribute>;

  @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => RequestedPredicate)
  public readonly requestedPredicates: Record<string, RequestedPredicate>;
}

class RequestRestriction {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public schema_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public schema_issuer_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public schema_name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public schema_version?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public issuer_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public cred_def_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public rev_reg_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public schema_issuer_did?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public issuer_did?: string;

  [key: `attr::${string}::marker`]: '1' | '0';
  [key: `attr::${string}::value`]: string;
}

class RequestedAttribute {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public names: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequestRestriction)
  public restrictions?: RequestRestriction[];
}

const predicateType = ['>=', '>', '<=', '<'] as const;

class RequestedPredicate {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsEnum(predicateType)
  public predicateType: (typeof predicateType)[number];

  @IsNumber()
  public predicateValue: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequestRestriction)
  public restrictions?: RequestRestriction[];
}
