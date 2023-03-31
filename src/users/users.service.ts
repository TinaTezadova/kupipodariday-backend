import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user-dto';
import { Wish } from '../wishes/wish.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { HashService } from 'src/hash/hash.service';

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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const params = {
      ...updateUserDto,
      password: this.hashService.generateHash(updateUserDto.password),
    };
    return this.userRepository.update(id, params);
  }

  async getOwnWishes(id: number): Promise<Wish[]> {
    const user = await this.findOne(id);
    console.log(user);

    return user.wishes;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getWishes(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);
    return user.wishes;
  }

  async findMany(params: { [key: string]: string }): Promise<User[]> {
    return await this.userRepository.find({ where: params });
  }
}
