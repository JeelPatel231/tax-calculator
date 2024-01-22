import { throwError } from 'src/utils/error';
import { TaxcalcRequestDto } from '../dto/taxcalc.request.dto';
import { SlabDataFactory } from './slab-data-factory';
import type { DataReturnType } from './transformation';
import { BadRequestException } from '@nestjs/common';

export type TaxSlabTransformDetails = Pick<TaxcalcRequestDto, 'slab' | 'age'>;

export async function TaxSlabTransformation(
  { slab, age }: TaxSlabTransformDetails,
  value: number,
): Promise<DataReturnType> {
  const slabForAge =
    slab.find(({ ageSlot }) =>
      SlabDataFactory.isAgeValidForSlot(ageSlot, age),
    ) ??
    throwError(
      new BadRequestException('Invalid Slab Data supplied for given age.'),
    );

  const answer = slabForAge.slab.reduce(
    (prev: number, { from, to, percent }) => {
      const taxable = Math.min(to ?? Number.POSITIVE_INFINITY, value) - from;
      return taxable > 0 ? (taxable * percent) / 100 + prev : prev;
    },
    0,
  );

  return { message: ['Applied TaxSlab Succesfully'], amount: answer };
}
