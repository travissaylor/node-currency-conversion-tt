export interface CurrencyProvider {
  getCurrencyRate(): Promise<number>;
}
