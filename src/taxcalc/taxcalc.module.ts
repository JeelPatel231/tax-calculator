import { Module } from '@nestjs/common';
import { TaxcalcService } from './taxcalc.service';
import { TaxcalcController } from './taxcalc.controller';

@Module({
  controllers: [TaxcalcController],
  providers: [TaxcalcService],
})
export class TaxcalcModule {}
