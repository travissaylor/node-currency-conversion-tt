import { Injectable } from '@nestjs/common';
import { CoinbaseService } from './coinbase/coinbase.service';
import { SupportedCurrencyExchangeSources } from './currency-source.entity';
import { RandomCurrencySourceService } from './random/random.service';

@Injectable()
export class CurrencySoruceFactory {
  constructor(
    protected readonly coinbaseService: CoinbaseService,
    protected readonly randomCurrencySource: RandomCurrencySourceService,
  ) {}

  getCurrencySource(source: SupportedCurrencyExchangeSources) {
    switch (source) {
      case SupportedCurrencyExchangeSources.COINBASE:
        return this.coinbaseService;
      case SupportedCurrencyExchangeSources.RANDOM:
        return this.randomCurrencySource;
      default:
        throw new Error('Invalid currency source');
    }
  }
}
