import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Wish } from '../../wishes/wish.entity';
import { Wishlist } from '../../wishlists/wishlist.entity';

export class User {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsString()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  wishes: Wish[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  offers: Wish[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wishlist)
  wishlists: Wishlist[];
}
