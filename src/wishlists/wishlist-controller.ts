import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistService } from './wishlist-service';
import { CreateWishlistDto } from './dto/create-wishlist-dto';
import { UpdateWishlistDto } from './dto/update-wishlist-dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @UseGuards(JwtGuard)
  findAll(): Promise<Wishlist[]> {
    return this.wishlistService.findAll();
  }

  @Post()
  @UseGuards(JwtGuard)
  create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistService.create(req.user.id, createWishlistDto);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = req.user.id;
    return this.wishlistService.update(id, updateWishlistDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async removeOne(@Req() req, @Param('id') id: number): Promise<Wishlist> {
    const userId = req.user.id;
    return this.wishlistService.remove(id, userId);
  }
}
