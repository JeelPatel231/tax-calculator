import { TaxcalcRequestDto } from '../dto/taxcalc.request.dto';
import { DataReturnType, RebateAddition } from './transformation';

export type Rebate87ADetails = Pick<
  RebateAddition<TaxcalcRequestDto>,
  'rebateData' | 'residence' | 'incomeAfterDeduction'
>;

// source: https://cleartax.in/s/income-tax-rebate-us-87a

export async function Rebate87ATransform(
  details: Rebate87ADetails,
  value: number,
): Promise<DataReturnType> {
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
