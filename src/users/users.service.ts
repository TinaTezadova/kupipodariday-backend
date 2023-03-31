import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user-dto';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { HashService } from 'src/hash/hash.service';
import { FindUsersDto } from './dto/find-users-dto';
import { ExceptionMessage } from '../consts/exception-message';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const params = {
      ...createUserDto,
      password: this.hashService.generateHash(createUserDto.password),
    };

    const user = await this.userRepository.create(params);

    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserWithPassword(searchParams: {
    id?: number;
    username?: string;
  }): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(searchParams)
      .getOne();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    } else {
      const params = {
        ...updateUserDto,
      };
      if (updateUserDto?.password) {
        params.password = this.hashService.generateHash(updateUserDto.password);
      }

      await this.userRepository.update(id, params);

      return this.findUserWithPassword({ id });
    }
  }

  async getOwnWishes(id: number): Promise<Wish[]> {
    const user = await this.findOne(id);
    return user.wishes;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.findUserWithPassword({ username });
    if (!user) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }
    return user;
  }

  async getWishes(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);
    const userWthwishes = await this.userRepository.findOne({
      relations: ['wishes'],
      where: { id: user.id },
    });
    return userWthwishes.wishes;
  }

  async findMany(findUsersDto: FindUsersDto): Promise<User[]> {
    const value = findUsersDto.query;
    const IsEmail = value.includes('@');
    const params = {} as { [key: string]: string };
    if (IsEmail) {
      params['email'] = value;
    } else {
      params['username'] = value;
    }
    const users = await this.userRepository.find({ where: params });
    if (users?.length) {
      return users;
    } else {
      throw new NotFoundException(ExceptionMessage.USERS_NOT_FOUND);
    }
  }
}
