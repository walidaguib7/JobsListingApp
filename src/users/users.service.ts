import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create.dto';
import { UpdateUserDto } from './dtos/update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findbyId(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      userId: userId,
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findbyUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      username: username,
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<void> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, passwordHash: hash });
    await this.usersRepository.save(user);
  }

  async updateUser(dto: UpdateUserDto, userId: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({
      userId: userId,
    });
    if (!user) throw new NotFoundException();

    const hash = await bcrypt.hash(dto.password, 10);
    user.email = dto.email;
    user.firstname = dto.firstname;
    user.lastname = dto.lastname;
    user.username = dto.username;
    user.passwordHash = hash;
    user.phone_number = dto.phone_number;
    await this.usersRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({
      userId: userId,
    });
    if (!user) throw new NotFoundException();
    await this.usersRepository.delete(user);
  }
}
