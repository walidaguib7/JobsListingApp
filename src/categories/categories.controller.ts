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
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCategory } from './dtos/create.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return await this.categoriesService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Recruiter)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Recruiter)
  @UseGuards(RolesGuard)
  @Post()
  async createOne(@Body() dto: CreateCategory) {
    await this.categoriesService.createOne(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Recruiter)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCategory,
  ) {
    await this.categoriesService.updateOne(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Recruiter)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.deleteOne(id);
  }
}
