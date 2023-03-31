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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish-dto';
import { WishesService } from './wishes-service';
import { Wish } from './wish.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { BadRequestException } from 'src/exeptions/bad-request.exeption';
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
    return await this.wishesService.create(req.user.id, createWishDto); //+
  }

  @UseGuards(JwtGuard)
  @Get('last')
  async findLast(): Promise<Wish[]> {
    return await this.wishesService.findLast(); //+
  }

  @UseGuards(JwtGuard)
  @Get('top')
  async findTop(): Promise<Wish[]> {
    return await this.wishesService.findTop(); //+
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number): Promise<Wish> {
    const userId = req.user.id;
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    } else {
      const { offers, ...otherParams } = wish;
      if (userId === wish.owner.id) {
        return wish;
      } else {
        return {
          ...otherParams,
          offers: offers.filter((offer) => offer.hidden === false),
        };
      }
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = req.user.id;
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    } else if (userId === wish.owner.id && !wish.offers) {
      if (updateWishDto.price !== wish.price) {
        if (!wish.offers) {
          return this.wishesService.update(id, { ...wish, ...updateWishDto });
        } else {
          throw new BadRequestException('Нельзя изменять стоимость');
        }
      }
      return this.wishesService.update(id, { ...wish, ...updateWishDto });
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(@Req() req, @Param('id') id: number): Promise<Wish> {
    const userId = req.user.id;
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    } else if (userId === wish.owner.id) {
      return await this.wishesService.remove(id);
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: number) {
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    }
    return this.wishesService.copyWish(req.user.id, id);
  }
}
