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
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() wishlist: CreateWishlistDto) {
    return this.wishlistsService.createWishlist(req.user, wishlist);
  }

  @UseGuards(JwtGuard)
  @Get()
  getWishLists() {
    return this.wishlistsService.getWishLists();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishList(@Param('id') id: string) {
    return this.wishlistsService.getWishList(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Req() req,
    @Param('id') id: string,
    @Body() wishlist: UpdateWishlistDto,
  ) {
    const list = await this.wishlistsService.getWishList(+id);
    if (!list) {
      throw new NotFoundException();
    }
    if (list.owner.id !== req.user.id) {
      throw new ForbiddenException();
    }
    await this.wishlistsService.updateWishlist(+id, wishlist);
    return { ...list, ...wishlist };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishlist(@Req() req, @Param('id') id: string) {
    const list = await this.wishlistsService.getWishList(+id);
    if (!list) {
      throw new NotFoundException();
    }
    if (list.owner.id !== req.user.id) {
      throw new ForbiddenException();
    }
    return this.wishlistsService.deleteWishlist(+id);
  }
}
