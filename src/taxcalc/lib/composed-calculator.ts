import { TaxcalcRequestDto } from '../dto/taxcalc.request.dto';
import { TaxSlabTransformation } from './slab-calculator';
import { CessTransformation } from './cess-transformation';
import { Rebate87ATransform } from './rebate87a-transformation';
import { Section80CDeduction } from './section80c-deduction';
import { StandardDeduction } from './standard-deduction';

import {
  DataReturnType,
  RebateAddition,
  Transformation,
} from './transformation';

function composeTransformations<T>(
  ...fns: ((_: T, __: number) => Promise<DataReturnType>)[]
) {
  return async (details: T, input: number) => {
    let lastValue = input;
    const allMessages: Record<string, DataReturnType> = {};

    for (const fn of fns) {
      const response = await fn(details, lastValue);
      lastValue = response.amount;
      allMessages[fn.name] = response;
    }

    return { amount: lastValue, message: allMessages };
  };
}

async function calculateTax<T extends TaxcalcRequestDto>(
  details: T,
  deductionTransformations: Transformation<T>[],
  rebateTransformations: Transformation<RebateAddition<T>>[],
) {
  const preTax = composeTransformations(...deductionTransformations);
  const tax = composeTransformations(TaxSlabTransformation);
  const postTax = composeTransformations(...rebateTransformations);

  const preTaxAmount = await preTax(details, details.grossIncome);
  const taxed = await tax(details, preTaxAmount.amount);
  const postTaxedAmount = await postTax(
    {
      ...details,
      incomeAfterDeduction: preTaxAmount.amount,
    },
    taxed.amount,
  );

  return {
    amount: postTaxedAmount.amount,
    message: {
      ...preTaxAmount.message,
      ...taxed.message,
      ...postTaxedAmount.message,
    },
  };
}

export async function calculateAll(details: TaxcalcRequestDto) {
  return await calculateTax(
    details,
    [StandardDeduction, Section80CDeduction],
    [Rebate87ATransform, CessTransformation],
  );
}
