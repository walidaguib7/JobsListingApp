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
import { ReviewsService } from './reviews.service';
import { PaginationDto } from './dtos/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'utils/enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateReview } from './dtos/create.dto';
import { UpdateReview } from './dtos/update.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAll(@Query() paginationQuery: PaginationDto) {
    return await this.reviewsService.getAll(paginationQuery);
  }

  @Get(':id')
  async getReview(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewsService.getReview(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Post()
  async createReview(@Body() dto: CreateReview) {
    await this.reviewsService.createReview(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReview,
  ) {
    await this.reviewsService.updateReview(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User, Role.Recruiter)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async DeleteReview(@Param('id', ParseIntPipe) id: number) {
    await this.reviewsService.deleteReview(id);
  }
}
