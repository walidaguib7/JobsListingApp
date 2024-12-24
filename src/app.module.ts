import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { dataSourceOptions } from 'config/database/data-source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from 'config/mail/mail.module';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
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
import { RedisOptions } from 'ioredis';

dotnev.config();

@Module({
  imports: [
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

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService): RedisModuleOptions => ({
        type: 'single',
        options: {
          host: config.get<string>('REDIS_HOST'),
          port: parseInt(config.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
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
  ],
})
export class AppModule {}
