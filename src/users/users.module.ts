import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { MediaModule } from 'src/media/media.module';
import { Media } from 'src/media/media.entity';
import Redis from 'ioredis';
import { MailModule } from 'config/mail/mail.module';
import { CachingModule } from 'config/caching/caching.module';
import { CachingService } from 'config/caching/caching.service';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User, Media]),
    forwardRef(() => AuthModule),
    MediaModule,
    CachingModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, CachingService],
  exports: [UsersService],
})
export class UsersModule {}
