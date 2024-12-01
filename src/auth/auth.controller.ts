import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from 'src/users/dtos/create.dto';

import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  async SignUp(@Body() dto: CreateUserDto) {
    await this.authService.SignUp(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('verifyAccount/:email/:code')
  async verifyAccount(
    @Param(':email') email: string,
    @Param(':code') code: string,
  ) {
    await this.userService.verifyAccount(email, code);
  }
}
