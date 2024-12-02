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
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateEmployerDto } from './dtos/create.dto';
import { UpdateEmployerDto } from './dtos/update.dto';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get(':id')
  async GetEmploayer(@Param('id', ParseIntPipe) id: number) {
    return await this.employerService.getEmployer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Post()
  async createEmployer(@Body() dto: CreateEmployerDto) {
    await this.employerService.createEmployer(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateEmployer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployerDto,
  ) {
    await this.employerService.updateEmployer(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Recruiter)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteEmployer(@Param('id', ParseIntPipe) id: number) {
    await this.employerService.deleteEmployer(id);
  }
}
