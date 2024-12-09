import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Employer } from 'src/employer/employer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmployerModule } from 'src/employer/employer.module';
import { UsersModule } from 'src/users/users.module';
import { CachingModule } from 'config/caching/caching.module';
import { JwtService } from '@nestjs/jwt';
import { EmployerService } from 'src/employer/employer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer]),
    AuthModule,
    CachingModule,
  ],
  controllers: [FollowingController],
  providers: [FollowingService, JwtService],
})
export class FollowingModule {}
