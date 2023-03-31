import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { FindUsersDto } from './dto/find-users-dto';
import { User } from './user.entity';
import { Wish } from '../wishes/wish.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from 'src/wishes/wishes-service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  async findOwn(@Req() req): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findOneByUserId(req.user.id);
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  async findMany(@Body() findUsersDto: FindUsersDto): Promise<User[]> {
    const value = findUsersDto.query;
    const IsEmail = value.includes('@');
    const params = {} as { [key: string]: string };
    if (IsEmail) {
      params['email'] = value;
    } else {
      params['username'] = value;
    }
    return this.usersService.findMany(params);
  }
}
