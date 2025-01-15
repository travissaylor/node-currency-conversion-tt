import { IsCurrency, IsEnum, IsOptional } from 'class-validator';
import { SupportedCurrencyExchangeSources } from 'src/currency-sources/currency-source.entity';

export enum SupportedCurrencies {
  USD = 'USD',
  EUR = 'EUR',
  BTC = 'BTC',
  ETH = 'ETH',
}

export class ConversionDto {
  @IsEnum(SupportedCurrencies)
  from: SupportedCurrencies;

  @IsEnum(SupportedCurrencies)
  to: SupportedCurrencies;

  @IsCurrency()
  amount: number;

  @IsEnum(SupportedCurrencyExchangeSources)
  @IsOptional()
  source: SupportedCurrencyExchangeSources;
}
