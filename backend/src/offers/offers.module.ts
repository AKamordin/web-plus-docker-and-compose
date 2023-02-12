import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity]), WishesModule, UsersModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
