import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SavedJobsService } from './saved_jobs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { SaveJob } from './dtos/create.dto';

@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.savedJobsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Post()
  async saveJob(@Body() dto: SaveJob) {
    await this.savedJobsService.saveJob(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async UnsaveJob(@Param('id', ParseIntPipe) id: number) {
    await this.savedJobsService.Unsave(id);
  }
}
