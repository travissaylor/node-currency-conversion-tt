import { Test, TestingModule } from '@nestjs/testing';
import { CurrencySoruceFactory } from './currency-source.factory';
import { CoinbaseService } from './coinbase/coinbase.service';
import { RandomCurrencySourceService } from './random/random.service';
import { SupportedCurrencyExchangeSources } from './currency-source.entity';
import { assertUnreachable } from 'src/util';

jest.mock('src/util', () => ({
  ...jest.requireActual('src/util'),
  assertUnreachable: jest.fn(() => {
    throw new Error('Unexpected currency source');
  }),
}));

describe('CurrencySourceFactory', () => {
  let service: CurrencySoruceFactory;
  let mockCoinbaseService: CoinbaseService;
  let mockRandomCurrencySource: RandomCurrencySourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencySoruceFactory,
        {
          provide: CoinbaseService,
          useValue: {}, // Mock the CoinbaseService
        },
        {
          provide: RandomCurrencySourceService,
          useValue: {}, // Mock the RandomCurrencySourceService
        },
      ],
    }).compile();

    service = module.get<CurrencySoruceFactory>(CurrencySoruceFactory);
    mockCoinbaseService = module.get<CoinbaseService>(CoinbaseService);
    mockRandomCurrencySource = module.get<RandomCurrencySourceService>(
      RandomCurrencySourceService,
    );
  });

  it('should return the CoinbaseService for COINBASE source', () => {
    const result = service.getCurrencySource(
      SupportedCurrencyExchangeSources.COINBASE,
    );
    expect(result).toBe(mockCoinbaseService);
  });

  it('should return the RandomCurrencySourceService for RANDOM source', () => {
    const result = service.getCurrencySource(
      SupportedCurrencyExchangeSources.RANDOM,
    );
    expect(result).toBe(mockRandomCurrencySource);
  });

  it('should call assertUnreachable for unsupported source', () => {
    expect(() =>
      service.getCurrencySource('UNSUPPORTED_SOURCE' as any),
    ).toThrowError('Unexpected currency source');
    expect(assertUnreachable).toHaveBeenCalledWith('UNSUPPORTED_SOURCE');
  });
});
