import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  DEFAULT_JWT_SECRET,
  DEFAULT_JWT_SECRET_EXPIRES_IN,
} from '../constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || DEFAULT_JWT_SECRET,
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_SECRET_EXPIRES_IN') ||
            DEFAULT_JWT_SECRET_EXPIRES_IN,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
