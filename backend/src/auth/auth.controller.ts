import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { AuthToken } from '../common/types/auth.token';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    const existingUser = await this.usersService.getUserByUsernameOrEmail(
      user.username,
      user.email,
    );
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким именем или почтой уже существует',
      );
    }
    const userObj = user.about
      ? user
      : { ...user, about: 'Пока ничего не рассказал о себе' };
    const createdUser = await this.usersService.createUser(userObj);
    return this.authService.signin(createdUser);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req): AuthToken {
    return this.authService.signin(req.user);
  }
}
