import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { IsInt, IsUrl, Length } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';
import { OfferEntity } from '../../offers/entities/offer.entity';

@Entity({ name: 'wish' })
export class WishEntity extends AbstractEntity {
  @Length(1, 250)
  @Column()
  name: string;

  @IsUrl()
  @Column()
  link: string;

  @IsUrl()
  @Column()
  image: string;

  @Column({
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
    nullable: true,
  })
  raised: number;

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  owner: UserEntity;

  @Length(1, 1024)
  @Column({
    nullable: true,
  })
  description: string;

  @OneToMany(() => OfferEntity, (offer) => offer.item)
  offers: OfferEntity[];

  @IsInt()
  @Column({
    nullable: true,
    default: 0,
  })
  copied: number;
}
