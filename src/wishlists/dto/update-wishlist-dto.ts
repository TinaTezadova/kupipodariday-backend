import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class UpdateWishlistDto {
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
