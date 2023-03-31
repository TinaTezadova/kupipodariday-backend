import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from 'src/exeptions/bad-request.exeption';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish-dto';
import { Wish } from './wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(ownerId: number, wish: CreateWishDto): Promise<Wish> {
    const user = await this.userService.findOne(ownerId);
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
      throw new BadRequestException('Необходимая сумма уже собрана');
    }
  }

  async remove(id: number): Promise<Wish> {
    const wish = await this.findOne(id);
    await this.wishesRepository.delete({ id });
    return wish;
  }

  async copyWish(userId: number, id: number): Promise<Wish> {
    const wish = await this.findOne(id);
    if (wish) {
      return this.create(userId, wish);
    }
    return null;
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
