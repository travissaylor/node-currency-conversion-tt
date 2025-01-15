import { Module } from '@nestjs/common';
import { ConversionModule } from './conversion/conversion.module';
import { DatabaseModule } from './database/database.module';
import { PerUserThrottlerGuard } from './common/per-user-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './common/auth.guard';
import { RequestStorageInterceptor } from './common/request-storage.interceptor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestStorageExceptionFilter } from './common/request-storage-exception.filter';
import { ConfigModule } from './config/config.module';

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
    ConfigModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PerUserThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestStorageInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: RequestStorageExceptionFilter,
    },
  ],
})
export class AppModule {}
