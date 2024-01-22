import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  AgeBasedTaxSlab,
  RebateLimitData,
  TaxcalcRequestDto,
} from './dto/taxcalc.request.dto';
import { TaxcalcService } from './taxcalc.service';
import { SlabRequestDto } from './dto/slab.request.dto';

@Controller()
export class TaxcalcController {
  constructor(private readonly service: TaxcalcService) {}

  @Post()
  @HttpCode(200)
  async calculate(@Body() data: TaxcalcRequestDto) {
    return this.service.calculate(data);
  }

  @Get('rebate/:year')
  async getRebateDataForYear(
    @Param('year', ParseIntPipe) year: number,
  ): Promise<RebateLimitData> {
    return this.service.getRebateDataForYear(year);
  }

  @Post('slab')
  async getSlabForYearAndRegime(
    @Body() { year, regime, age }: SlabRequestDto,
  ): Promise<AgeBasedTaxSlab> {
    return this.service.getSlabForYearAndRegime(year, regime, age);
  }
}
