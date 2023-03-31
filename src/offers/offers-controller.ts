import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer-dto';
import { OffersService } from './offers-service';
import { Offer } from './entities/offer.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { WishesService } from 'src/wishes/wishes-service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(
    @Req() req,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const userId = req.user.id;
    return this.offersService.create(userId, createOfferDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAllOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOneOffer(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
