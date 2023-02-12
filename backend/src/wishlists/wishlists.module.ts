import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishesModule } from '../wishes/wishes.module';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity]), WishesModule],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
