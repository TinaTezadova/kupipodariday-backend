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
import { Offer } from '../../offers/offer.entity';

export class UserWishesDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsNumber()
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];
}
