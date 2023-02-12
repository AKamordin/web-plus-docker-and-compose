import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    private readonly wishesService: WishesService,
  ) {}

  async createWishlist(owner: UserEntity, wishlist: CreateWishlistDto) {
    const items = await this.wishesService.getWishes({
      where: { id: In(wishlist.itemsId || []) },
    });
    return this.wishlistRepository.save({
      ...wishlist,
      owner,
      items,
    });
  }

  getWishList(id: number): Promise<WishlistEntity> {
    return this.wishlistRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: { id },
    });
  }

  getWishLists(): Promise<WishlistEntity[]> {
    return this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  updateWishlist(id: number, wishlist: UpdateWishlistDto) {
    return this.wishlistRepository.update({ id }, wishlist);
  }

  deleteWishlist(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}
