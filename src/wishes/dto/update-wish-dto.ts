import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  price: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description: string;
}
