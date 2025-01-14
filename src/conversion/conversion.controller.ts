import { Controller, Get } from '@nestjs/common';

@Controller()
export class ConversionController {
  constructor() {}

  @Get()
  currencyConversion() {}
}
