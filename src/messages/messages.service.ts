import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './messages.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CachingService } from 'config/caching/caching.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Conversation } from 'src/conversations/conversation.entity';
import { SendMessageDto } from './dtos/create.dto';
import { UpdateMessageDto } from './dtos/update.dto';
import { MessagesPaginator } from './dtos/pagination.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateWay: NotificationsGateway,
    private readonly cachingService: CachingService,
  ) {}

  async getAllMessages(
    conversationId: number,
    paginationDto: MessagesPaginator,
  ) {
    const { limit, page } = paginationDto;
    const key = `messages_${conversationId}_${limit}_${page}`;
    const cachedMessages =
      await this.cachingService.getFromCache<Messages[]>(key);
    if (cachedMessages) return cachedMessages;

    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
      relations: {
        messages: true,
      },
    });

    if (!conversation) throw new NotFoundException();

    const messages = conversation.messages;

    await this.cachingService.setAsync(key, messages);
    return messages;
  }

  async sendMessage(dto: SendMessageDto) {
    const { content, receiverId, senderId, conversationId } = dto;
    const conversation = await this.conversationsRepository.findOneBy({
      id: conversationId,
    });
    if (!conversation) throw new NotFoundException('conversation not found!');

    const sender = await this.usersService.findbyId(senderId);
    const receiver = await this.usersService.findbyId(receiverId);
    const message = this.messagesRepository.create({
      content: dto.content,
      receiver,
      sender,
      conversation,
    });
    await this.messagesRepository.save(message);

    const notification = this.notificationsService.notify({
      message: `${sender.username} sent a new message to you`,
      userUserId: senderId,
    });
    await this.cachingService.removeByPattern('messages');
    return message;
  }

  async updateMessage(id: number, dto: UpdateMessageDto) {
    const message = await this.messagesRepository.findOneBy({
      id,
    });
    if (!message) throw new NotFoundException('message not found!');
    message.content = dto.content;

    await this.messagesRepository.save(message);
    await this.cachingService.removeByPattern('messages');
  }

  async deleteMessage(id: number) {
    const message = await this.messagesRepository.findOneBy({
      id,
    });
    if (!message) throw new NotFoundException('message not found!');
    await this.messagesRepository.remove(message);
    await this.cachingService.removeByPattern('messages');
  }
}
