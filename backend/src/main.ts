import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: configuration().allowedOrigins,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders: ['content-type'],
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  const PORT = configuration().port;
  await app.listen(PORT);
}

bootstrap().then(() => console.log('Started'));
