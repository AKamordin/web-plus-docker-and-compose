import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string | string[]>('allowedOrigins'),
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['content-type'],
  })
  app.useGlobalPipes(new ValidationPipe());
  const PORT = configService.get<number>('port');
  await app.listen(PORT);
}

bootstrap().then(() => console.log('Started'));
