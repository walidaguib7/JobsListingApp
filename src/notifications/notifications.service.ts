import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotification } from './dtos/create.dto';
import { UsersService } from 'src/users/users.service';
import { CachingService } from 'config/caching/caching.service';
import { UpdateNotification } from './dtos/update.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable({ scope: Scope.DEFAULT })
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly cachingService: CachingService,
  ) {}

  async notify(dto: CreateNotification) {
    const user = await this.usersService.findbyId(dto.userUserId);
    const result = this.notificationsRepository.create({
      message: dto.message,
      user: user,
    });
    await this.notificationsRepository.save(result);
  }

  async fetchAll(userId: number) {
    const user = await this.usersService.findbyId(userId);
    const notifications = await this.notificationsRepository.find({
      where: { user },
    });
    return notifications;
  }

  async update(id: number, dto: UpdateNotification) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException();
    notification.isRead = true;
    await this.notificationsRepository.save(notification);
  }

  async removeOne(id: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException();
    await this.notificationsRepository.remove(notification);
  }

  async removeAll(userId: number) {
    const result = await this.fetchAll(userId);
    await this.notificationsRepository.remove(result);
  }
}
