import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { WishEntity } from './entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishEntity])],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
