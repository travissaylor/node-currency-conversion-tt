import { SupportedCurrencies } from 'src/conversion/conversion.dto';

export type ExchangeInput = {
  from: SupportedCurrencies;
  to: SupportedCurrencies;
  amount: number;
};

export interface CurrencySource {
  exchange(input: ExchangeInput): Promise<number>;
}
