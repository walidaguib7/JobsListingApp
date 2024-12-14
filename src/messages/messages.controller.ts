import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateMessageDto } from './dtos/update.dto';
import { MessagesPaginator } from './dtos/pagination.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  async fetchAll(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query() query: MessagesPaginator,
  ) {
    return await this.messagesService.getAllMessages(conversationId, query);
  }

  @Patch(':id')
  async updateMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMessageDto,
  ) {
    await this.messagesService.updateMessage(id, dto);
  }

  @Delete(':id')
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    await this.messagesService.deleteMessage(id);
  }
}
