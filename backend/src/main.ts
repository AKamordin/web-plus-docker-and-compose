import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DEFAULT_PORT } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const origins = configService.get<string>('ALLOWED_ORIGINS').split(',') || '*';
  app.enableCors({origin: origins});
  const PORT = configService.get<number>('PORT') || DEFAULT_PORT;
  await app.listen(PORT);
}

bootstrap().then(() => console.log('Started'));
