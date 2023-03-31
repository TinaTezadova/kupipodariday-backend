import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
