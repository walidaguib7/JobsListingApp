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
import { JobService } from './job.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateJobDto } from './dtos/create.dto';
import { UpdateJobDto } from './dtos/update.dto';
import { PaginationDto } from 'helpers/PaginatoinDto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return await this.jobService.getAllJobs(paginationDto);
  }

  @Get(':id')
  async findJob(@Param('id', ParseIntPipe) id: number) {
    return await this.jobService.getJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Post()
  async createJob(@Body() dto: CreateJobDto) {
    await this.jobService.createJob(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateJob(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobDto,
  ) {
    await this.jobService.updateJob(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteJob(@Param('id', ParseIntPipe) id: number) {
    await this.jobService.deleteJob(id);
  }
}
