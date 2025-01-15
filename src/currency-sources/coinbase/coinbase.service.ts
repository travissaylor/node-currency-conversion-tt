import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';
import { SupportedCurrencies } from 'src/conversion/conversion.dto';
import { ExchangeRatesOutput } from './coinbase.entity';
import { CurrencySource, ExchangeInput } from '../currency-source.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CoinbaseService implements CurrencySource {
  protected readonly baseUrl = 'https://api.coinbase.com';
  protected readonly apiKeyName: string;
  protected readonly apiKeySecret: string;

  constructor(
    @Inject() protected readonly configService: ConfigService,
    @Inject() protected readonly httpService: HttpService,
  ) {
    this.apiKeyName = this.configService.get('COINBASE_KEY_NAME');
    this.apiKeySecret = this.configService.get('COINBASE_KEY_SECRET');
  }

  public async exchange(input: ExchangeInput) {
    const exchangeRates = await this.getExchangeRatesMap(input.from);

    if (!exchangeRates.data.rates[input.to]) {
      throw new Error('Invalid currency');
    }

    return input.amount * parseFloat(exchangeRates.data.rates[input.to]);
  }

  protected async getExchangeRatesMap(
    currency: SupportedCurrencies,
  ): Promise<ExchangeRatesOutput> {
    const response = await this.request<ExchangeRatesOutput>(
      'GET',
      `v2/exchange-rates?currency=${currency}`,
    );

    if (!response.data) {
      throw new Error('Invalid response from Coinbase');
    }

    return response.data;
  }

  protected generateJwt(method: string, requestUri: string) {
    const algorithm = 'ES256';

    const payload = {
      iss: 'cdp',
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: this.apiKeyName,
      uri: `${method} ${requestUri}`,
    };

    const header = {
      alg: algorithm,
      kid: this.apiKeyName,
      nonce: randomBytes(16).toString('hex'),
    };

    return sign(payload, this.apiKeySecret, { algorithm, header });
  }

  protected async request<T>(method: string, path: string) {
    const jwt = this.generateJwt(method, `${this.baseUrl}/${path}`);

    return this.httpService.axiosRef.request<T>({
      method,
      url: `${this.baseUrl}/${path}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }
}
