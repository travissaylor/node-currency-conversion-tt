import { CurrencySource, ExchangeInput } from '../currency-source.interface';

export class RandomCurrencySourceService implements CurrencySource {
  async exchange(input: ExchangeInput): Promise<number> {
    return Math.random() * input.amount;
  }
}
