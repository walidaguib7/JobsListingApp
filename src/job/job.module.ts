import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { EmployerModule } from 'src/employer/employer.module';
import { EmployerService } from 'src/employer/employer.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import Redis from 'ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Employer } from 'src/employer/employer.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { CachingModule } from 'config/caching/caching.module';
import { Category } from 'src/categories/category.entity';
import { SavedJobsModule } from '../saved_jobs/saved_jobs.module';

@Module({
  imports: [
    CachingModule,
    EmployerModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Job, Employer, Category]),
  ],

  controllers: [JobController],
  providers: [JobService, EmployerService, JwtService, Redis],
  exports: [JobService],
})
export class JobModule {}
