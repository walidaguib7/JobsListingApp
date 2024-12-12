import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { Namespace, Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@WebSocketGateway()
export class NotificationsGateway {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notify')
  notify(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onReceive', body);
  }

  async handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (!userId) {
      client.disconnect();
    }

    // Fetch the companies the user follows
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: {
        followed_companies: true,
      },
    });
    if (!user) {
      client.disconnect();
    }

    for (const company of user.followed_companies) {
      client.join(`followed_companies_${company.id}`);
      if (client.disconnected) {
        client.leave(`followed_companies_${company.id}`);
        console.log('client disconnected!');
      }
    }
  }
}
