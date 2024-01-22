import { Body, Controller, Post } from '@nestjs/common';
import { TaxcalcRequestDto } from './dto/taxcalc.request.dto';
import { TaxcalcService } from './taxcalc.service';

@Controller()
export class TaxcalcController {
  constructor(private readonly service: TaxcalcService) {}

  @Post()
  async calculate(@Body() data: TaxcalcRequestDto) {
    return this.service.calculate(data);
  }
}
