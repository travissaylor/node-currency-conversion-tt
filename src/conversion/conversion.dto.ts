import { IsCurrency, IsEnum } from 'class-validator';

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
}
