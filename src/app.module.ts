import { Module } from '@nestjs/common';
import { ConversionModule } from './conversion/conversion.module';
import { DatabaseModule } from './database/database.module';
import { PerUserThrottlerGuard } from './common/per-user-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConversionModule,
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'PerUser',
        ttl: 86400000,
        limit: 100, // this will be dynamically overridden by the guard
      },
    ]),
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: PerUserThrottlerGuard,
    },
  ],
})
export class AppModule {}
