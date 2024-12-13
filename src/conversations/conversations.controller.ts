import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsPaginator } from './dtos/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateConversation } from './dtos/create.dto';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateConversation } from './dtos/update.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all/:userId')
  async getAllConversations(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ConversationsPaginator,
  ) {
    return await this.conversationsService.getAll(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/:employerId')
  async getConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('employerId', ParseIntPipe) employerId: number,
  ) {
    return await this.conversationsService.getOne(userId, employerId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter, Role.User)
  @UseGuards(RolesGuard)
  @Post()
  async createConversation(@Body() dto: CreateConversation) {
    await this.conversationsService.createOne(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter, Role.User)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConversation,
  ) {
    await this.conversationsService.updateOne(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter, Role.User)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteConversation(@Param('id', ParseIntPipe) id: number) {
    await this.conversationsService.deleteOne(id);
  }
}
