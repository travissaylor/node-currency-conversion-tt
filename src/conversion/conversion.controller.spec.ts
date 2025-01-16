import { Test, TestingModule } from '@nestjs/testing';
import { ConversionController } from './conversion.controller';
import { SupportedCurrencyExchangeSources } from '../currency-sources/currency-source.entity';
import { SupportedCurrencies } from './conversion.dto';
import { ConversionService } from './conversion.service';
import { CurrencySoruceFactory } from 'src/currency-sources/currency-source.factory';
import { RandomCurrencySourceService } from 'src/currency-sources/random/random.service';
import { CoinbaseService } from 'src/currency-sources/coinbase/coinbase.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';

const mockRandomValue = 0.123456789;

const mockHttpService = {
  axiosRef: {
    request: jest.fn(() =>
      Promise.resolve({
        data: { data: { rates: { USD: 1.0, EUR: 2.0, BTC: 0.5, ETH: 0.7 } } },
      }),
    ),
  },
};

describe('ConversionController', () => {
  let conversionController: ConversionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseService, ConfigModule, HttpModule],
      controllers: [ConversionController],
      providers: [
        ConversionService,
        CurrencySoruceFactory,
        CoinbaseService,
        RandomCurrencySourceService,
        {
          provide: HttpService,
          useValue: mockHttpService, // Override HttpService
        },
      ],
    }).compile();

    conversionController = app.get<ConversionController>(ConversionController);

    jest.spyOn(global.Math, 'random').mockReturnValue(mockRandomValue);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  describe('currencyConversion', () => {
    describe('when the source is RANDOM', () => {
      it('should return a random number conversion result when specifying RANDOM as source', async () => {
        const conversionDto = {
          source: SupportedCurrencyExchangeSources.RANDOM,
          from: SupportedCurrencies.BTC,
          to: SupportedCurrencies.USD,
          amount: 1,
        };

        const result =
          await conversionController.currencyConversion(conversionDto);

        expect(result).toEqual(mockRandomValue);
      });
    });
    describe('when the source is COINBASE', () => {
      it('should return a conversion result from Coinbase wehn specifying COINBASE as source', async () => {
        const conversionDto = {
          source: SupportedCurrencyExchangeSources.COINBASE,
          from: SupportedCurrencies.BTC,
          to: SupportedCurrencies.USD,
          amount: 1,
        };

        const result =
          await conversionController.currencyConversion(conversionDto);

        expect(result).toEqual(1);
      });
      it('should return a conversion result from Coinbase wehn not specifying a source', async () => {
        const conversionDto = {
          source: SupportedCurrencyExchangeSources.COINBASE,
          from: SupportedCurrencies.BTC,
          to: SupportedCurrencies.USD,
          amount: 1,
        };

        const result =
          await conversionController.currencyConversion(conversionDto);

        expect(result).toEqual(1);
      });
    });
  });
});
