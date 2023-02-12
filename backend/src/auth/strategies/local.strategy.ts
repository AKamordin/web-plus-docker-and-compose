import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { removeProperty } from '../../common/utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.checkUserPassword(username, password);
    if (!user) {
      throw new UnauthorizedException(
        'Не правильно введен пользователь или пароль',
      );
    }
    return removeProperty('password', user);
  }
}
