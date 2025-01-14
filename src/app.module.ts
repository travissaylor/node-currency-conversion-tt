import { Module } from '@nestjs/common';
import { ConversionModule } from './conversion/conversion.module';
import { DatabaseModule } from './database/database.module';
import { PerUserThrottlerGuard } from './common/per-user-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './common/auth.guard';

@Module({
  imports: [
    ConversionModule,
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'PerUser',
        ttl: 86400000,
        limit: () => {
          const now = new Date();
          const isWeekend = [0, 6].includes(now.getDay());
          return isWeekend ? 200 : 100;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: PerUserThrottlerGuard,
    },
  ],
})
export class AppModule {}
