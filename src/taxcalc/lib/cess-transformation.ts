import { TaxcalcRequestDto } from '../dto/taxcalc.request.dto';
import { DataReturnType } from './transformation';

export type CessTransformationDetails = Pick<TaxcalcRequestDto, 'cessPercent'>;

export async function CessTransformation(
  details: CessTransformationDetails,
  value: number,
): Promise<DataReturnType> {
  if (details.cessPercent < 0 || details.cessPercent > 100)
    throw new Error('Cess must be between 0 to 100');

  return {
    message: ['Applied CESS Sucessfully'],
    amount: (value * (100 + details.cessPercent)) / 100,
  };
}
