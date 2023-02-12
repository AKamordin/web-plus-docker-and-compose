import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { WishEntity } from '../../wishes/entities/wish.entity';
import { OfferEntity } from '../../offers/entities/offer.entity';
import { WishlistEntity } from '../../wishlists/entities/wishlist.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @IsNotEmpty()
  @Length(2, 30)
  @Column({
    unique: true,
  })
  username: string;

  @Length(0, 200)
  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @IsUrl()
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  email: string;

  @IsNotEmpty()
  @Column({
    select: false,
  })
  password: string;

  @OneToMany(() => WishEntity, (wish) => wish.owner)
  wishes: WishEntity[];

  @OneToMany(() => OfferEntity, (offer) => offer.user)
  offers: OfferEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.owner)
  wishlists: WishlistEntity[];
}
