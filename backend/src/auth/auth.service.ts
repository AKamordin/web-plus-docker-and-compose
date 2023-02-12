import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { AuthToken } from '../common/types/auth.token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  signin(user: UserEntity): AuthToken {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async checkUserPassword(username: string, password: string) {
    const user = await this.usersService.getUserByUsername(username, true);
    if (!user) {
      throw new UnauthorizedException('Нет такого пользователя');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (user && isValid) {
      return user;
    }
    return null;
  }
}
