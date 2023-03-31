import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from './dto/create-offer-dto';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes-service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const { itemId, ...otherParams } = createOfferDto;
    const user = await this.userService.findOne(userId);
    const wish = await this.wishesService.updateRaised(
      itemId,
      createOfferDto.amount,
    );

    const params = {
      ...otherParams,
      user,
      item: wish,
    };
    return this.offersRepository.save(params);
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({
      relations: ['user', 'item'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      relations: ['user', 'item'],
      where: { id },
    });
  }
}
