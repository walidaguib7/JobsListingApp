import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { dataSourceOptions } from 'config/database/data-source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from 'config/mail/mail.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { EmployerModule } from './employer/employer.module';

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
    RedisModule.forRoot(
      {
        type: 'single',
        options: {
          port: 6379,
          host: 'localhost',
        },
      },
      '',
    ),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    MediaModule,
    EmployerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
