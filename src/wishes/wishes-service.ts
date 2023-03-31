import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from 'src/exeptions/bad-request.exeption';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish-dto';
import { UpdateWishDto } from './dto/update-wish-dto';
import { Wish } from './entities/wish.entity';
import { ExceptionMessage } from '../consts/exception-message';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(ownerId: number, wish: CreateWishDto): Promise<Wish> {
    const user = await this.userService.findUserWithPassword({ id: ownerId });
    const params = {
      ...wish,
      owner: user,
    };
    return this.wishesRepository.save(params);
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishesRepository.findOne({
      relations: ['owner', 'offers', 'wishlist'],
      where: { id },
    });
  }

  async findOneById(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(ExceptionMessage.WISH_NOT_FOUND);
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

  async findAllByIdIn(ids: number[]): Promise<Wish[]> {
    return this.wishesRepository.findBy({ id: In(ids) });
  }

  async findOneByUserId(userid: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      relations: ['owner', 'offers', 'wishlist'],
      where: {
        owner: { id: userid },
      },
    });
  }

  async update(id: number, updatedWish: Wish) {
    return this.wishesRepository.update({ id }, updatedWish);
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(ExceptionMessage.WISH_NOT_FOUND);
    } else if (userId === wish.owner.id) {
      if (updateWishDto.price !== wish.price) {
        if (!wish.offers?.length) {
          return this.update(id, { ...wish, ...updateWishDto });
        } else {
          throw new BadRequestException(
            ExceptionMessage.WISH_PRICE_UPDATE_FORBIDDEN,
          );
        }
      } else {
        return this.update(id, { ...wish, ...updateWishDto });
      }
    } else {
      throw new ForbiddenException(ExceptionMessage.WISH_UPDATE_FORBIDDEN);
    }
  }

  async updateRaised(wishId: number, newAmount: number): Promise<Wish> {
    const wish = await this.findOne(wishId);
    const newRaised = wish.raised + newAmount;
    if (newRaised < wish.price) {
      const newParams = {
        ...wish,
        raised: newRaised,
      };
      await this.update(wishId, newParams);
      return this.findOne(wishId);
    } else {
      throw new BadRequestException(
        ExceptionMessage.WISH_RAISED_UPDATE_FORBIDDEN,
      );
    }
  }

  async remove(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException(ExceptionMessage.WISH_NOT_FOUND);
    } else if (userId === wish.owner.id) {
      const wish = await this.findOne(id);
      await this.wishesRepository.remove(wish);
      return wish;
    } else {
      throw new ForbiddenException(ExceptionMessage.WISH_DELETE_FORBIDDEN);
    }
  }

  async copyWish(userId: number, id: number): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish) {
      const createWishDto = {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      };
      return this.create(userId, createWishDto);
    } else {
      throw new NotFoundException(ExceptionMessage.WISH_NOT_FOUND);
    }
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'wishlist'],
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'wishlist'],
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
    return wishes;
  }
}
