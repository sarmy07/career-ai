import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });

    if (!email) return null;
    return user;
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);

    return await this.userRepo.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();

    Object.assign(user, dto);
    return await this.userRepo.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
