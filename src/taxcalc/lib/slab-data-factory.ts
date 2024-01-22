import { NotFoundException } from '@nestjs/common';
import {
  AgeBasedTaxSlab,
  AgeType,
  RegimeType,
} from '../dto/taxcalc.request.dto';
import { throwError } from 'src/utils/error';

export class SlabDataFactory {
  static SLAB_DATA: Record<string, Record<RegimeType, AgeBasedTaxSlab[]>> = {
    '24': {
      OLD: [
        {
          ageSlot: AgeType.LessThan60,
          slab: [
            { from: 0, to: 2_50_000, percent: 0 },
            { from: 2_50_000, to: 5_00_000, percent: 5 },
            { from: 5_00_000, to: 10_00_000, percent: 20 },
            { from: 10_00_000, to: null, percent: 30 },
          ],
        },

        {
          ageSlot: AgeType.From60To80,
          slab: [
            { from: 0, to: 3_00_000, percent: 0 },
            { from: 3_00_000, to: 5_00_000, percent: 5 },
            { from: 5_00_000, to: 10_00_000, percent: 20 },
            { from: 10_00_000, to: null, percent: 30 },
          ],
        },

        {
          ageSlot: AgeType.MoreThan80,
          slab: [
            { from: 0, to: 5_00_000, percent: 0 },
            { from: 5_00_000, to: 10_00_000, percent: 20 },
            { from: 10_00_000, to: null, percent: 30 },
          ],
        },
      ],
      NEW: [
        {
          ageSlot: AgeType.All,
          slab: [
            { from: 0, to: 3_00_000, percent: 0 },
            { from: 3_00_000, to: 6_00_000, percent: 5 },
            { from: 6_00_000, to: 9_00_000, percent: 10 },
            { from: 9_00_000, to: 12_00_000, percent: 15 },
            { from: 12_00_000, to: 15_00_000, percent: 20 },
            { from: 15_00_000, to: null, percent: 30 },
          ],
        },
      ],
    },
  };

  static slotFromAge(age: number) {
    if (age > 80) return AgeType.MoreThan80;
    if (age >= 60) return AgeType.From60To80;
    return AgeType.LessThan60;
  }

  static isAgeValidForSlot(slot: AgeType, age: number) {
    if (AgeType.All == slot) return true;

    return this.slotFromAge(age) == slot;
  }

  static get(year: number) {
    return (
      this.SLAB_DATA[year] ??
      throwError(new NotFoundException('Data for given Year not found'))
    );
  }
}
