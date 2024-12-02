import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employer } from './employer.entity';
import { User } from 'src/users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employer, User]),
    UsersModule,
    AuthModule,
  ],
  controllers: [EmployerController],
  providers: [EmployerService, JwtService],
})
export class EmployerModule {}
