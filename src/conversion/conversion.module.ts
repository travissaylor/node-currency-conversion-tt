import { Module } from '@nestjs/common';
import { ConversionController } from 'src/conversion/conversion.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseService],
  controllers: [ConversionController],
  providers: [],
})
export class ConversionModule {}
