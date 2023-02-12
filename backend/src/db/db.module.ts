import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DEFAULT_DB_HOST,
  DEFAULT_DB_NAME,
  DEFAULT_DB_PASS,
  DEFAULT_DB_PORT,
  DEFAULT_DB_USER,
} from '../constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') || DEFAULT_DB_HOST,
        port: configService.get<number>('POSTGRES_PORT') || DEFAULT_DB_PORT,
        database: configService.get<string>('POSTGRES_DB') || DEFAULT_DB_NAME,
        username: configService.get<string>('POSTGRES_USER') || DEFAULT_DB_USER,
        password: configService.get<string>('POSTGRES_PASSWORD') || DEFAULT_DB_PASS,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DbModule {}
