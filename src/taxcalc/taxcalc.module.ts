import { Module } from '@nestjs/common';
import { TaxcalcController } from './taxcalc.controller';
import { TaxcalcService } from './taxcalc.service';

@Module({
  controllers: [TaxcalcController],
  providers: [TaxcalcService],
})
export class TaxcalcModule {}
