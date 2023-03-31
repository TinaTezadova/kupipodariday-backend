import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { FindUsersDto } from './dto/find-users-dto';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
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
    return this.usersService.findMany(findUsersDto);
  }
}
