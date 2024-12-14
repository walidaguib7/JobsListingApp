import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dtos/create.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly notificationService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() body: SendMessageDto) {
    const message = await this.messagesService.sendMessage(body);
    const notification = this.notificationService.notify({
      message: `${message.sender.username} sent a new message to you`,
      userUserId: message.sender.userId,
    });

    this.server.emit('onReceiveMessage', {
      msg: message.content,
      from: message.sender.username,
      to: message.receiver.username,
      at: message.sentAt,
    });
  }

  async handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (!userId) {
      client.disconnect();
    }

    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: {
        conversations: true,
      },
    });
    if (!user) client.disconnect();

    for (const conversation of user.conversations) {
      client.join(`conversation_${conversation.id}`);
    }
  }
}
