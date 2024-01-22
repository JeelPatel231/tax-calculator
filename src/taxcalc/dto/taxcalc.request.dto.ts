import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export function IsPositiveNumber() {
  return (target: any, key: string) => {
    IsNumber({ allowNaN: false })(target, key);
    Min(0)(target, key);
  };
}

export function IsPercentage() {
  return (target: any, key: string) => {
    IsPositiveNumber()(target, key);
    Max(100);
  };
}

export enum RegimeType {
  OLD = 'OLD',
  NEW = 'NEW',
}

export enum ResidentType {
  Resident = 'Resident',
  NonResident = 'NonResident',
  NonOrdinaryResident = 'NonOrdinaryResident',
}

export enum TaxPayerType {
  Individual = 'Individual',
  HUF = 'HUF',
  AOPs = 'AOPs',
  BOI = 'BOI',
  DomesticCompany = 'DomesticCompany',
  ForeignCompany = 'ForeignCompany',
  Firms = 'Firms',
  LLP = 'LLP',
  CoOperativeSociety = 'CoOperativeSociety',
}

export enum AgeType {
  All = 'All',
  LessThan60 = '60-', // 60 Not Included
  From60To80 = '60-80', // 60 and 80 Both included
  MoreThan80 = '80+', // 80 Not included
}

export class AgeBasedTaxSlab {
  @IsEnum(RegimeType)
  regime: RegimeType;

  @IsEnum(AgeType)
  ageSlot: AgeType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxSlab)
  slab: TaxSlab[];
}

export class TaxSlab {
  @IsPositiveNumber()
  from: number;

  @IsOptional()
  @IsPositiveNumber()
  to: number;

  @IsPercentage()
  percent: number;
}

export class RebateLimitData {
  @IsPositiveNumber()
  limit: number;

  @IsPositiveNumber()
  max_rebate: number;
}

export class TaxcalcRequestDto {
  @IsPercentage()
  cessPercent: number;

  @IsEnum(RegimeType)
  regime: RegimeType;

  @IsPositiveNumber()
  financialYear: number;

  @IsEnum(ResidentType)
  residence: ResidentType;

  @IsEnum(TaxPayerType)
  type: TaxPayerType;

  @IsPositiveNumber()
  age: number;

  @IsPositiveNumber()
  grossIncome: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgeBasedTaxSlab)
  slab: AgeBasedTaxSlab[];

  @ValidateNested()
  @IsObject()
  @Type(() => RebateLimitData)
  rebateData: RebateLimitData;

  @ValidateIf((o) => o.regime == RegimeType.OLD)
  @IsPositiveNumber()
  s80Cdeductions: number;
}
