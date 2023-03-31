import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist-dto';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes-service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly userService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      relations: ['owner', 'items'],
      where: { id },
    });
  }

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const { itemsId, ...otherParams } = createWishlistDto;
    const user = await this.userService.findOne(userId);
    const wishes = await this.wishesService.findAllByIdIn(itemsId);
    const params = {
      ...otherParams,
      owner: user,
      items: wishes,
    } as unknown as Wishlist;
    return this.wishlistRepository.save(params);
  }

  async update(id: number, updateWishlist: Wishlist) {
    return this.wishlistRepository.update({ id }, updateWishlist);
  }

  async remove(id: number): Promise<Wishlist> {
    const wish = await this.findOne(id);
    await this.wishlistRepository.delete({ id });
    return wish;
  }
}
