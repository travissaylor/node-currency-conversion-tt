import { Module } from '@nestjs/common';
import { CoinbaseService } from './coinbase/coinbase.service';
import { CurrencySoruceFactory } from './currency-source.factory';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CurrencySoruceFactory, CoinbaseService, ConfigService],
  exports: [CurrencySoruceFactory],
})
export class CurrencySourcesModule {}
