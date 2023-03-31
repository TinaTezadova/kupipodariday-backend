import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(0)
  @MaxLength(200)
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  password?: string;
}
