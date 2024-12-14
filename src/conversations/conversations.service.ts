import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import {
  FindManyOptions,
  FindOptions,
  FindOptionsWhere,
  ILike,
  Like,
  Repository,
} from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { EmployerService } from 'src/employer/employer.service';
import { CachingService } from 'config/caching/caching.service';
import { CreateConversation } from './dtos/create.dto';
import { UpdateConversation } from './dtos/update.dto';
import { ConversationsPaginator } from './dtos/pagination.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    private readonly usersService: UsersService,

    private readonly cachingService: CachingService,
  ) {}

  async getAll(userId: number, paginationDto: ConversationsPaginator) {
    const { limit, page, title } = paginationDto;
    const key = `conversations_${userId}_${limit}_${page}_${title}`;
    const cachedConversations =
      await this.cachingService.getFromCache<Conversation[]>(key);
    if (cachedConversations) return cachedConversations;
    const user = await this.usersService.findbyId(userId);
    const whereClause: FindOptionsWhere<ConversationsPaginator> = {};

    if (title) {
      whereClause.title = Like(`%${title}%`);
    }

    const conversations = await this.conversationsRepository.find({
      where: {
        ...whereClause,
        user,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    await this.cachingService.setAsync(key, conversations);
    return conversations;
  }

  async getOne(userId: number, employerId: number) {
    const key = `conversation_${userId}_${employerId}`;
    const cachedConversation =
      await this.cachingService.getFromCache<Conversation>(key);
    if (cachedConversation != null) return cachedConversation;
    const user = await this.usersService.findbyId(userId);
    const employer = await this.usersService.findbyId(employerId);
    const conversation = await this.conversationsRepository.findOne({
      where: { user: user, employer: employer },
    });
    if (!conversation) throw new NotFoundException('conversation not found');
    await this.cachingService.setAsync(key, conversation);
    return conversation;
  }

  async createOne(dto: CreateConversation) {
    const user = await this.usersService.findbyId(dto.userId);
    const employer = await this.usersService.findbyId(dto.employerId);
    const conversation = this.conversationsRepository.create({
      title: dto.title,
      user,
      employer,
    });
    await this.conversationsRepository.save(conversation);
    await this.cachingService.removeByPattern('conversations');
    await this.cachingService.removeByPattern('conversation');
  }

  async updateOne(id: number, dto: UpdateConversation) {
    const conversation = await this.conversationsRepository.findOneBy({
      id,
    });
    if (!conversation) throw new NotFoundException('conversation not found!');
    conversation.title = dto.title;
    await this.conversationsRepository.save(conversation);
    await this.cachingService.removeByPattern('conversations');
    await this.cachingService.removeByPattern('conversation');
  }

  async deleteOne(id: number) {
    const conversation = await this.conversationsRepository.findOneBy({
      id,
    });
    if (!conversation) throw new NotFoundException('conversation not found!');
    await this.conversationsRepository.remove(conversation);
    await this.cachingService.removeByPattern('conversations');
    await this.cachingService.removeByPattern('conversation');
  }
}
