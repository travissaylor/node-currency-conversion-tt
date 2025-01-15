import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConversionController } from 'src/conversion/conversion.controller';
import { CurrencySoruceFactory } from 'src/currency-sources/currency-source.factory';
import { DatabaseService } from 'src/database/database.service';
import { ConversionService } from './conversion.service';
import { CurrencySourcesModule } from 'src/currency-sources/currency-sources.module';
import { CoinbaseService } from 'src/currency-sources/coinbase/coinbase.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseService, ConfigModule, CurrencySourcesModule, HttpModule],
  controllers: [ConversionController],
  providers: [ConversionService, CurrencySoruceFactory, CoinbaseService],
})
export class ConversionModule {}
