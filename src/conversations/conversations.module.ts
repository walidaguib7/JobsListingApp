import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Employer } from 'src/employer/employer.entity';
import { Conversation } from './conversation.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CachingModule } from 'config/caching/caching.module';
import { JwtService } from '@nestjs/jwt';
import { EmployerModule } from 'src/employer/employer.module';
import { EmployerService } from 'src/employer/employer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employer, Conversation]),
    AuthModule,
    UsersModule,
    CachingModule,
    EmployerModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, JwtService, EmployerService],
})
export class ConversationsModule {}
