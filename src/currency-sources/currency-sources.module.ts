import { Module } from '@nestjs/common';
import { CoinbaseService } from './coinbase/coinbase.service';
import { CurrencySoruceFactory } from './currency-source.factory';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RandomCurrencySourceService } from './random/random.service';

@Module({
  imports: [HttpModule],
  providers: [
    ConfigService,
    CurrencySoruceFactory,
    CoinbaseService,
    RandomCurrencySourceService,
  ],
  exports: [CurrencySoruceFactory],
})
export class CurrencySourcesModule {}
