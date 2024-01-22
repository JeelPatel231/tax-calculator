import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AgeBasedTaxSlab,
  RebateLimitData,
  RegimeType,
  TaxcalcRequestDto,
} from './dto/taxcalc.request.dto';
import { calculateAll } from './lib/composed-calculator';
import { RebateDataFactory } from './lib/rebate-data-factory';
import { SlabDataFactory } from './lib/slab-data-factory';
import { throwError } from 'src/utils/error';

@Injectable()
export class TaxcalcService {
  async calculate(data: TaxcalcRequestDto) {
    return await calculateAll(data);
  }

  async getRebateDataForYear(year: number): Promise<RebateLimitData> {
    return RebateDataFactory.get(year);
  }

  async getSlabForYearAndRegime(
    year: number,
    regime: RegimeType,
    age: number,
  ): Promise<AgeBasedTaxSlab> {
    const regimeData =
      SlabDataFactory.get(year)[regime] ??
      throwError(new NotFoundException('Data not found for given regime'));

    return (
      regimeData.find(({ ageSlot }) =>
        SlabDataFactory.isAgeValidForSlot(ageSlot, age),
      ) ?? throwError(new NotFoundException())
    );
  }
}
