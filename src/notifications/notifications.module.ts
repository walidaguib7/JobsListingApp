import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Notification } from './notification.entity';
import { UsersModule } from 'src/users/users.module';
import { CachingModule } from 'config/caching/caching.module';
import { Socket } from 'socket.io';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notification]),
    AuthModule,
    UsersModule,
    CachingModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService, JwtService],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
