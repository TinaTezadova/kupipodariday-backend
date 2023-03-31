import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish-dto';
import { WishesService } from './wishes-service';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { UpdateWishDto } from './dto/update-wish-dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(req.user.id, createWishDto);
  }

  @Get('last')
  async findLast(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOneById(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = req.user.id;
    return this.wishesService.updateWish(id, updateWishDto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeOne(@Req() req, @Param('id') id: number): Promise<Wish> {
    const userId = req.user.id;
    return this.wishesService.remove(id, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: number) {
    return this.wishesService.copyWish(req.user.id, id);
  }
}
