import {
  RegimeType,
  ResidentType,
  TaxcalcRequestDto,
} from '../dto/taxcalc.request.dto';
import { DataReturnType } from './transformation';

export type Section80CDeductionDetails = Pick<
  TaxcalcRequestDto,
  | 's80Cdeductions'
  | 'type'
  | 'residence'
  | 'age'
  | 'grossIncome'
  | 'financialYear'
  | 'regime'
>;

export async function Section80CDeduction(
  details: Section80CDeductionDetails,
  value: number,
): Promise<DataReturnType> {
  if (details.regime != RegimeType.OLD) {
    return {
      amount: value,
      message: [`not applicable due to Regime selection`],
    };
  }

  if (details.residence != ResidentType.Resident) {
    return {
      amount: value,
      message: [`not applicable due to Residence selection`],
    };
  }

  if (!(details.type == 'HUF' || details.type == 'Individual')) {
    return {
      amount: value,
      message: [`not applicable due to TaxPayer Type`],
    };
  }

  const messages: string[] = [];
  if (details.s80Cdeductions > 1_50_000) {
    messages.push(
      'Maximum Deductions on 80C is 1_50_000, limiting the deduction implicitly',
    );
  }

  if (details.grossIncome < value)
    throw new Error('Something is really wrong, income < entered amount ');

  messages.push('Applied Section 80C Transformation on value');

  return {
    message: messages,
    amount: value - Math.min(value, details.s80Cdeductions, 1_50_000),
  };
}
