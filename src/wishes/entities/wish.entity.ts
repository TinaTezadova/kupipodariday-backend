import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Min, Max, IsUrl, IsDate, IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @IsDate()
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @IsDate()
  updatedAt: Date;

  @Column({ nullable: false })
  @Min(1)
  @Max(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column({ default: '' })
  @IsUrl()
  image: string;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlist: Wishlist;

  @Column()
  @Min(1)
  @Max(1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 0 })
  copied: number;
}
