import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConversionDto } from './conversion.dto';

@Controller({ version: '1', path: 'convert' })
export class ConversionController {
  constructor() {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  currencyConversion(@Query() conversionDto: ConversionDto) {
    return conversionDto;
  }
}
