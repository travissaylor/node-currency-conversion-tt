import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConversionController } from 'src/conversion/conversion.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseService, ConfigModule],
  controllers: [ConversionController],
  providers: [],
})
export class ConversionModule {}
