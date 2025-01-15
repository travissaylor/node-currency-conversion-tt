import { Injectable } from '@nestjs/common';
import { ConversionDto } from './conversion.dto';
import { CurrencySoruceFactory } from 'src/currency-sources/currency-source.factory';

@Injectable()
export class ConversionService {
  constructor(
    protected readonly currencySourceFactory: CurrencySoruceFactory,
  ) {}

  async currencyConversion(conversionDto: ConversionDto) {
    const source = 'coinbase'; // todo replace with dynamic source
    const currencySource = this.currencySourceFactory.getCurrencySource(source);
    return currencySource.exchange(conversionDto);
  }
}
