import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { WishEntity } from '../../wishes/entities/wish.entity';

@Entity({ name: 'offer' })
export class OfferEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.offers)
  user: UserEntity;

  @ManyToOne(() => WishEntity, (wish) => wish.offers)
  item: WishEntity;

  @Column()
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
