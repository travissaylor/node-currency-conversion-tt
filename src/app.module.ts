import { Module } from '@nestjs/common';
import { ConversionModule } from './conversion/conversion.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConversionModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
