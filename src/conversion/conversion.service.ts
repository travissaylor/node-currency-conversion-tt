import { Injectable } from '@nestjs/common';
import { ConversionDto } from './conversion.dto';
import { CurrencySoruceFactory } from 'src/currency-sources/currency-source.factory';
import { SupportedCurrencyExchangeSources } from 'src/currency-sources/currency-source.entity';

@Injectable()
export class ConversionService {
  constructor(
    protected readonly currencySourceFactory: CurrencySoruceFactory,
  ) {}

  async currencyConversion(conversionDto: ConversionDto) {
    const currencySource = this.currencySourceFactory.getCurrencySource(
      conversionDto.source ?? SupportedCurrencyExchangeSources.COINBASE,
    );
    return currencySource.exchange(conversionDto);
  }
}
