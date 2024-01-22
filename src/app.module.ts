import { Module } from '@nestjs/common';
import { TaxcalcModule } from './taxcalc/taxcalc.module';

@Module({
  imports: [TaxcalcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
