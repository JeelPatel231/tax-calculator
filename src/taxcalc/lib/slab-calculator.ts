import { TaxcalcRequestDto } from '../dto/taxcalc.request.dto';
import type { DataReturnType } from './transformation';

export type TaxSlabTransformDetails = Pick<
  TaxcalcRequestDto,
  'slab' | 'ageSlot'
>;

export async function TaxSlabTransformation(
  { slab, ageSlot }: TaxSlabTransformDetails,
  value: number,
): Promise<DataReturnType> {
  const slabForAge = slab.find(({ age }) => age === ageSlot).slab;

  const answer = slabForAge.reduce((prev: number, { from, to, percent }) => {
    const taxable = Math.min(to ?? Number.POSITIVE_INFINITY, value) - from;
    return taxable > 0 ? (taxable * percent) / 100 + prev : prev;
  }, 0);

  return { message: ['Applied TaxSlab Succesfully'], amount: answer };
}
