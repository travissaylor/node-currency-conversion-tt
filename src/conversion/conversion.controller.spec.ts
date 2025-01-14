import { Test, TestingModule } from '@nestjs/testing';
import { ConversionController } from './conversion.controller';

describe('ConversionController', () => {
  let conversionController: ConversionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConversionController],
      providers: [],
    }).compile();

    conversionController = app.get<ConversionController>(ConversionController);
  });

  describe('currencyConversion', () => {
    it('should return "currencyConversion"', () => {
      conversionController.currencyConversion();
      throw new Error('Test not implemented');
    });
  });
});
