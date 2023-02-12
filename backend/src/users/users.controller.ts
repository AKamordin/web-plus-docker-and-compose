import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserEntity } from './entities/user.entity';
import { UsersQuery } from '../common/types/users.query';
import { WishEntity } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getUser(@Req() req) {
    return this.usersService.getUser(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(
    @Req() req,
    @Body() user: UpdateUserDto,
  ): Promise<UserEntity> {
    const currentUser = await this.usersService.getUser(req.user.id);
    if (!currentUser) {
      throw new NotFoundException('Пользователь не найден');
    }
    const existingUser = await this.usersService.getExistingUser(
      currentUser.id,
      user.username ? user.username : currentUser.username,
      user.email ? user.email : currentUser.email,
    );
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким именем или почтой уже существует',
      );
    }
    await this.usersService.updateUser(
      currentUser.id,
      user,
      user.password != null,
    );
    return this.usersService.getUser(currentUser.id);
  }

  @Post('find')
  getUsers(@Body() usersQuery: UsersQuery): Promise<UserEntity[]> {
    return this.usersService.getUsers(usersQuery);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  public async getOwnWishes(@Req() req): Promise<WishEntity[]> {
    return this.wishesService.getUserWishes(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  public async findUserWishes(
    @Param('username') username: string,
  ): Promise<WishEntity[]> {
    const user = await this.usersService.getUserByUsername(username);
    return this.wishesService.getUserWishes(user.id);
  }
}
