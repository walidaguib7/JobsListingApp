import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateApplication } from './dtos/create.dto';
import { UpdateApplication } from './dtos/update.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async getAll() {
    return await this.applicationsService.getAllApplication();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Get('job/:jobId')
  async getJobApplications(@Param('jobId', ParseIntPipe) jobId: number) {
    return await this.applicationsService.getJobApplications(jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getApplication(@Param('id', ParseIntPipe) id: number) {
    return await this.applicationsService.getApplication(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Post()
  async apply(@Body() dto: CreateApplication) {
    await this.applicationsService.Apply(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateApplication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplication,
  ) {
    await this.applicationsService.updateApplication(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async RemoveApplication(@Param('id', ParseIntPipe) id: number) {
    await this.applicationsService.RemoveApplication(id);
  }
}
