import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationPaginatorDto } from './dtos/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':id')
  async getAll(
    @Param('id', ParseIntPipe) userId: number,
    @Query() query: NotificationPaginatorDto,
  ) {
    return await this.notificationsService.fetchAll(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter, Role.User)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.update(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter, Role.User)
  @UseGuards(RolesGuard)
  @Patch('all/:userId')
  async updateAll(@Param('userId', ParseIntPipe) userId: number) {
    await this.notificationsService.updateAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter, Role.User)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.removeOne(id);
  }

  @Delete('all/:userId')
  async deleteAll(@Param('userId', ParseIntPipe) userId: number) {
    await this.notificationsService.removeAll(userId);
  }
}
