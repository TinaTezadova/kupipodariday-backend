import { IsString, IsNotEmpty, IsUrl, IsNumber, Min } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
