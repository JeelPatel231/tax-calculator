import { TaxcalcRequestDto } from '../dto/taxcalc.request.dto';
import { DataReturnType, RebateAddition } from './transformation';

// export type Rebate87ADetails = Pick<
//   RebateAddition<TaxcalcRequestDto>,
//   'financialYear' | 'residence' | 'incomeAfterDeduction'
// >;

export type Rebate87ADetails = Pick<
  RebateAddition<TaxcalcRequestDto>,
  'rebateData' | 'residence' | 'incomeAfterDeduction'
>;

// source: https://cleartax.in/s/income-tax-rebate-us-87a
// private getNearestYear(arr: number[], year: number): number {
//   for (let i = arr.length; i >= 0; i--) {
//     if (arr[i] <= year) return arr[i];
//   }
//   throw new Error('Nearest Year not found');
// }

// private MAX_REBATE_DATA: Record<
//   number,
//   { limit: number; max_rebate: number }
// > = {
//   23: { limit: 7_00_000, max_rebate: 25000 },
//   19: { limit: 5_00_000, max_rebate: 12500 },
//   17: { limit: 3_50_000, max_rebate: 2500 },
//   16: { limit: 5_00_000, max_rebate: 5000 },
//   13: { limit: 5_00_000, max_rebate: 2000 },
// };

export async function Rebate87ATransform(
  details: Rebate87ADetails,
  value: number,
): Promise<DataReturnType> {
  // const yearKeys = Object.keys(this.MAX_REBATE_DATA).map((x) => parseInt(x));
  // const chosenYear = this.getNearestYear(yearKeys, details.financialYear);

  const { limit, max_rebate } = details.rebateData;

  if (details.residence !== 'Resident') {
    return {
      amount: value,
      message: [`Rebate 87A Not Applicable, you must be a resident!`],
    };
  }

  // if(details.regime == 'New' && details.financialYear >= 23){
  //   console.info(`Applied Rebate 87A Successfully on value`, value)
  //   return value - Math.min(max_rebate, value)
  // }

  // now the regime must be old
  // if(details.regime == 'New') {
  //   console.warn('Rebate 87A Not Applicable due to regime selection')
  //   return value // not applicable
  // }

  if (details.incomeAfterDeduction > limit) {
    return {
      amount: value,
      message: ['Rebate not applicable due to limit exceeded'],
    };
  }

  return {
    amount: value - Math.min(max_rebate, value),
    message: [`Applied Rebate 87A Successfully on value`],
  };
}
