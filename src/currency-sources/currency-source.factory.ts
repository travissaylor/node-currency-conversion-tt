import { Injectable } from '@nestjs/common';
import { CoinbaseService } from './coinbase/coinbase.service';

@Injectable()
export class CurrencySoruceFactory {
  constructor(protected readonly coinbaseService: CoinbaseService) {}

  getCurrencySource(source: string) {
    switch (source) {
      case 'coinbase':
        return this.coinbaseService;
      default:
        throw new Error('Invalid currency source');
    }
  }
}
