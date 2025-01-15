import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConversionDto } from './conversion.dto';
import { ConversionService } from './conversion.service';

@Controller({ version: '1', path: 'convert' })
export class ConversionController {
  constructor(protected readonly conversionService: ConversionService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async currencyConversion(@Query() conversionDto: ConversionDto) {
    return await this.conversionService.currencyConversion(conversionDto);
  }
}
