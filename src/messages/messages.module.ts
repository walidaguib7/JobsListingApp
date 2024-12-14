import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Messages } from './messages.entity';
import { MessagesController } from './messages.controller';
import { UsersModule } from 'src/users/users.module';
import { Notification } from 'src/notifications/notification.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CachingModule } from 'config/caching/caching.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Conversation } from 'src/conversations/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Messages, Notification, Conversation]),
    UsersModule,
    AuthModule,
    NotificationsModule,
    CachingModule,
    ConversationsModule,
  ],
  providers: [MessagesGateway, MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
