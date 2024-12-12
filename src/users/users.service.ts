import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { Media } from 'src/media/media.entity';
import { MediaService } from 'src/media/media.service';
import Redis from 'ioredis';
import { MailService } from 'config/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
    private readonly cacheDB: Redis,
    private readonly mailService: MailService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: {
        media: true,
      },
    });
  }

  async findbyId(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      userId,
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

    const user = this.usersRepository.create({
      ...dto,
      passwordHash: hash,
      roles: dto.role,
    });
    const media = await this.mediaService.getFile(dto.mediaId);
    if (!media) throw new NotFoundException('media file not found!');
    user.media = media;
    // adding verification into redis db
    const code = randomBytes(3).toString('hex');
    await this.cacheDB.set(`code_${dto.email}`, code, 'EX', 120);
    // send email verification
    await this.mailService.sendEmail(dto.email, code);
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
    await this.usersRepository.remove(user);
  }

  async verifyAccount(email: string, code: string) {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    if (!user) throw new NotFoundException();
    const verification_code = await this.cacheDB.get(`code_${email}`);
    if (code == verification_code) {
      user.isVerified = true;
      await this.usersRepository.save(user);
    } else throw new BadRequestException('verification code is invalid!');
    const cachedData = await this.cacheDB.keys('code_*');
    for (const item in cachedData) {
      await this.cacheDB.del(item);
    }
  }
}
