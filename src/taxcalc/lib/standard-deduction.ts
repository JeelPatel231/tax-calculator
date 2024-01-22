import { DataReturnType } from './transformation';

/**
 * Standard Deduction Rs. 50,000
 * Amount of Standard Deduction is Rs. 50,000 or amount of salary/pension,
 * whichever is lower.
 *
 * Note: The standard deduction under section 16(ia) is available only
 * for Pension Chargeable under the head "Income under the head Salaries"
 * and not for Pension chargeable under "Income from Other Sources".
 */
export async function StandardDeduction(
  _: unknown,
  value: number,
): Promise<DataReturnType> {
  return {
    message: ['Applying Standard Deduction on value'],
    amount: value - Math.min(50_000, value),
  };
}
