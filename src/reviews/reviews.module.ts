import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Employer } from 'src/employer/employer.entity';
import { Review } from './review.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmployerModule } from 'src/employer/employer.module';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { EmployerService } from 'src/employer/employer.service';
import { CachingModule } from 'config/caching/caching.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer, Review]),
    AuthModule,
    EmployerModule,
    UsersModule,
    CachingModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtService, EmployerService],
})
export class ReviewsModule {}
