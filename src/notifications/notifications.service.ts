import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotification } from './dtos/create.dto';
import { UsersService } from 'src/users/users.service';
import { CachingService } from 'config/caching/caching.service';

import { NotificationPaginatorDto } from './dtos/pagination.dto';

@Injectable()
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
    await this.cachingService.removeByPattern('notifications');
  }

  async fetchAll(userId: number, paginationDto: NotificationPaginatorDto) {
    const { limit, page } = paginationDto;
    const key = `notifications_${userId}_${page}_${limit}`;
    const cachedNotifications =
      await this.cachingService.getFromCache<Notification[]>(key);
    if (cachedNotifications) return cachedNotifications;

    const user = await this.usersService.findbyId(userId);
    const notifications = await this.notificationsRepository.find({
      where: {
        user: user,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    await this.cachingService.setAsync(key, notifications);
    return notifications;
  }

  async getOne(id: number) {
    const user = await this.usersService.findbyId(id);
    return await this.notificationsRepository.findOne({
      where: { user },
    });
  }

  async update(id: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException();
    notification.isRead = true;
    await this.notificationsRepository.save(notification);
    await this.cachingService.removeByPattern('notifications');
  }

  async updateAll(userId: number) {
    const user = await this.usersService.findbyId(userId);
    const notifications = await this.notificationsRepository.find({
      where: { user },
    });

    for (const notification of notifications) {
      await this.notificationsRepository.update(notification, {
        isRead: true,
      });
    }

    await this.cachingService.removeByPattern('notifications');
  }

  async removeOne(id: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException();
    await this.notificationsRepository.remove(notification);
    await this.cachingService.removeByPattern('notifications');
  }

  async removeAll(userId: number) {
    const user = await this.usersService.findbyId(userId);
    const result = await this.notificationsRepository.find({
      where: { user },
    });
    await this.notificationsRepository.remove(result);
    await this.cachingService.removeByPattern('notifications');
  }
}
