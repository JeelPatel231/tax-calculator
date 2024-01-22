import { Injectable } from '@nestjs/common';
import { TaxcalcRequestDto } from './dto/taxcalc.request.dto';
import { calculateAll } from './lib/composed-calculator';

@Injectable()
export class TaxcalcService {
  async calculate(data: TaxcalcRequestDto) {
    return await calculateAll(data);
  }
}
