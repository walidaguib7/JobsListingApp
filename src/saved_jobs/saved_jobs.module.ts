import { Module } from '@nestjs/common';
import { SavedJobsService } from './saved_jobs.service';
import { SavedJobsController } from './saved_jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Job } from 'src/job/job.entity';
import { Saved_Jobs } from './saved_jobs.entity';
import { CachingModule } from 'config/caching/caching.module';
import { JobModule } from 'src/job/job.module';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Job, Saved_Jobs]),
    CachingModule,
    JobModule,
    UsersModule,
  ],
  controllers: [SavedJobsController],
  providers: [SavedJobsService, JwtService],
})
export class SavedJobsModule {}
