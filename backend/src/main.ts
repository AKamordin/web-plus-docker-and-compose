import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {origin: ['http://kpd.akamodin.nomoredomains.work', 'https://kpd.akamodin.nomoredomains.work']}
  });
  app.useGlobalPipes(new ValidationPipe());
  const PORT = configuration().port;
  await app.listen(PORT);
}

bootstrap().then(() => console.log('Started'));
