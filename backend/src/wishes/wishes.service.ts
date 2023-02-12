import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishEntity } from './entities/wish.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { removeProperties } from '../common/utils';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(WishEntity)
    private readonly wishRepository: Repository<WishEntity>,
  ) {}

  createWish(owner: UserEntity, wishDto: CreateWishDto): Promise<WishEntity> {
    return this.wishRepository.save({
      ...wishDto,
      owner,
    });
  }

  async copyWish(owner: UserEntity, id: number): Promise<WishEntity> {
    const wish = await this.getWish(+id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.updateWish(wish.id, {
        copied: ++wish.copied,
      });
      const copiedWish = this.createWish(
        owner,
        removeProperties(
          wish,
          'id',
          'createdAt',
          'updatedAt',
          'raised',
          'copied',
        ),
      );
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Ошибка при копировании подарка');
    } finally {
      await queryRunner.release();
    }
  }

  getWish(id: number): Promise<WishEntity> {
    return this.wishRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
      where: { id },
    });
  }

  getWishes(ids: FindManyOptions<WishEntity>): Promise<WishEntity[]> {
    return this.wishRepository.find(ids);
  }

  getUserWishes(id: number): Promise<WishEntity[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
    });
  }

  getLastWishes(num: number): Promise<WishEntity[]> {
    return this.wishRepository.find({
      take: num,
      order: { createdAt: 'DESC' },
    });
  }

  getTopWishes(num: number): Promise<WishEntity[]> {
    return this.wishRepository.find({
      take: num,
      order: { copied: 'DESC' },
    });
  }

  updateWish(id: number, wish: UpdateWishDto) {
    return this.wishRepository.update(id, wish);
  }

  deleteWish(id: number) {
    return this.wishRepository.delete({ id });
  }
}
