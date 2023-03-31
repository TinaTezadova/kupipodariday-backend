import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer-dto';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes-service';
import { ExceptionMessage } from '../consts/exception-message';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    if (!wish) {
      throw new NotFoundException(ExceptionMessage.WISH_NOT_FOUND);
    } else if (userId !== wish.owner.id) {
      const { itemId, ...otherParams } = createOfferDto;
      const user = await this.userService.findUserWithPassword({ id: userId });
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
    } else {
      throw new ForbiddenException(ExceptionMessage.OFFER_CREATE_FORBIDDEN);
    }
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
