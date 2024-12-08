import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Media } from 'src/media/media.entity';
import { Job } from 'src/job/job.entity';
import { Application } from './application.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JobModule } from 'src/job/job.module';
import { MediaModule } from 'src/media/media.module';
import { CachingModule } from 'config/caching/caching.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media, Job, Application]),
    AuthModule,
    UsersModule,
    JobModule,
    MediaModule,
    CachingModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, JwtService],
})
export class ApplicationsModule {}
