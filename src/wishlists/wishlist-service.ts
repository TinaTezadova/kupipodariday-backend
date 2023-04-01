import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist-dto';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes-service';
import { ExceptionMessage } from '../consts/exception-message';
import { UpdateWishlistDto } from './dto/update-wishlist-dto';

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
    const user = await this.userService.findUserWithPassword({ id: userId });
    const wishes = await this.wishesService.findAllByIdIn(itemsId);
    const params = {
      ...otherParams,
      owner: user,
      items: wishes,
    } as unknown as Wishlist;
    return this.wishlistRepository.save(params);
  }

  async update(id: number, updateWishlist: UpdateWishlistDto, userId: number) {
    const { itemsId, ...otherParams } = updateWishlist;
    const wishlist = await this.findOne(id);
    const wishes = await this.wishesService.findAllByIdIn(itemsId);
    if (!wishlist) {
      throw new NotFoundException(ExceptionMessage.WISHLIST_NOT_FOUND);
    } else if (userId === wishlist.owner.id) {
      return this.wishlistRepository.save({
        ...wishlist,
        ...otherParams,
        items: wishes,
      });
    } else {
      throw new ForbiddenException(ExceptionMessage.WISHLIST_UPDATE_FORBIDDEN);
    }
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException(ExceptionMessage.WISHLIST_NOT_FOUND);
    } else if (userId === wishlist.owner.id) {
      await this.wishlistRepository.remove(wishlist);
      return wishlist;
    } else {
      throw new ForbiddenException(ExceptionMessage.WISH_DELETE_FORBIDDEN);
    }
  }
}
