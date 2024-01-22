import { NotFoundException } from '@nestjs/common';
import { RebateLimitData } from '../dto/taxcalc.request.dto';

export class RebateDataFactory {
  static MAX_REBATE_DATA: Record<number, RebateLimitData> = {
    23: { limit: 7_00_000, max_rebate: 25000 },
    19: { limit: 5_00_000, max_rebate: 12500 },
    17: { limit: 3_50_000, max_rebate: 2500 },
    16: { limit: 5_00_000, max_rebate: 5000 },
    13: { limit: 5_00_000, max_rebate: 2000 },
  };

  private static getNearestYear(arr: number[], year: number): number {
    for (let i = arr.length; i >= 0; i--) {
      if (arr[i] <= year) return arr[i];
    }
    throw new NotFoundException('Nearest Year not found');
  }

  static get(year: number) {
    const yearKeys = Object.keys(this.MAX_REBATE_DATA).map((x) => parseInt(x));
    const chosenYear = this.getNearestYear(yearKeys, year);

    return this.MAX_REBATE_DATA[chosenYear];
  }
}
