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
import { FollowingService } from './following.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowDto } from './follow.dto';

@UseGuards(JwtAuthGuard)
@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Get('followers/:companyId')
  async getCompanyFollowers(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return await this.followingService.getCompanyFollowers(companyId);
  }

  @Get('followings/:userId')
  async getUserFollowedCompanies(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.followingService.getUserFollowedCompanies(userId);
  }

  @Post()
  async followCompany(@Body() dto: FollowDto) {
    await this.followingService.followCompany(dto);
  }

  @Delete('unfollow/:userId/:companyId')
  async Unfollow(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    await this.followingService.unfollow(userId, companyId);
  }
}
