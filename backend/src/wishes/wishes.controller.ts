import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { LAST_WISHES_NUMBER, TOP_WISHES_NUMBER } from '../constants';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes(LAST_WISHES_NUMBER);
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes(TOP_WISHES_NUMBER);
  }

  @UseGuards(JwtGuard)
  @Post()
  createWish(@Req() req, @Body() wishDto: CreateWishDto) {
    return this.wishesService.createWish(req.user, wishDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWish(@Param('id') id: string) {
    return this.wishesService.getWish(+id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: string) {
    return await this.wishesService.copyWish(req.user, +id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() wish: UpdateWishDto,
  ) {
    const currentWish = await this.wishesService.getWish(+id);
    if (!currentWish) {
      throw new NotFoundException();
    }
    if (currentWish.owner.id !== req.user.id) {
      throw new ForbiddenException();
    }
    await this.wishesService.updateWish(+id, wish);
    return { ...currentWish, ...wish };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(@Req() req, @Param('id') id: string) {
    const wish = await this.wishesService.getWish(+id);
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id !== req.user.id || wish.raised > 0) {
      throw new ForbiddenException('Нельзя удалить подарок');
    }
    return this.wishesService.deleteWish(+id);
  }
}
