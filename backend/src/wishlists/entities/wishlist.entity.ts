import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';
import { WishEntity } from '../../wishes/entities/wish.entity';

@Entity({ name: 'wishlist' })
export class WishlistEntity extends AbstractEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({
    default: 'Моя коллекция',
  })
  @Length(1, 1500)
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.wishlists)
  @IsNotEmpty()
  owner: UserEntity;

  @ManyToMany(() => WishEntity)
  @JoinTable()
  @IsOptional()
  items: WishEntity[];
}
