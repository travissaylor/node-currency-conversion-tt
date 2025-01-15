import { SupportedCurrencies } from 'src/conversion/conversion.dto';

export type ExchangeRatesOutput = {
  data: {
    currency: SupportedCurrencies;
    rates: {
      [key in SupportedCurrencies]: string;
    };
  };
};
