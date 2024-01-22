import { IsEnum } from 'class-validator';
import { IsPositiveNumber, RegimeType } from './taxcalc.request.dto';

export class SlabRequestDto {
  @IsPositiveNumber()
  year: number;

  @IsEnum(RegimeType)
  regime: RegimeType;

  @IsPositiveNumber()
  age: number;
}
