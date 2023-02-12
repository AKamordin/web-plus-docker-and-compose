import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(OfferEntity)
    private readonly offerRepository: Repository<OfferEntity>,
    private readonly wishesService: WishesService,
  ) {}

  async createOffer(
    user: UserEntity,
    offer: CreateOfferDto,
  ): Promise<OfferEntity> {
    const wish = await this.wishesService.getWish(offer.itemId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish.raised + offer.amount > wish.price) {
      throw new BadRequestException('Сумма заявки превышает стоимость подарка');
    }
    if (user.id === wish.owner.id) {
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.wishesService.updateWish(wish.id, {
        raised: wish.raised + offer.amount,
      });
      const updatedWish = await this.wishesService.getWish(wish.id);
      const updatedOffer = await this.offerRepository.save({
        ...offer,
        user,
        item: updatedWish,
      });
      await queryRunner.commitTransaction();
      return updatedOffer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Ошибка при создании оффера');
    } finally {
      await queryRunner.release();
    }
  }

  getOffers(): Promise<OfferEntity[]> {
    return this.offerRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });
  }

  getOffer(id: number): Promise<OfferEntity> {
    return this.offerRepository.findOne({
      relations: {
        item: true,
        user: true,
      },
      where: { id },
    });
  }

  updateOffer(id: number, offer: UpdateOfferDto) {
    return this.offerRepository.update(id, offer);
  }

  deleteOffer(id: number) {
    return this.offerRepository.delete(id);
  }
}
