import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Config>);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
