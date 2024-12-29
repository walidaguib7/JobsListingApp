import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'config/database/data-source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmployerModule } from './employer/employer.module';
import { JobModule } from './job/job.module';
import { CategoriesModule } from './categories/categories.module';
import { SavedJobsModule } from './saved_jobs/saved_jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FollowingModule } from './following/following.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import * as dotnev from 'dotenv';
import { CachingModule } from 'config/caching/caching.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

dotnev.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        secure: false,
        auth: {
          user: 'username',
          pass: 'pass',
        },
      },
      defaults: {
        from: 'JobsApp@dev.org',
      },
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    MediaModule,
    EmployerModule,
    JobModule,
    CategoriesModule,
    SavedJobsModule,
    ApplicationsModule,
    ReviewsModule,
    FollowingModule,
    NotificationsModule,
    ConversationsModule,
    MessagesModule,
    CachingModule,
  ],
})
export class AppModule {}
