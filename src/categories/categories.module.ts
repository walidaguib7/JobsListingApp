import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { CachingModule } from 'config/caching/caching.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, CachingModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtService],
})
export class CategoriesModule {}
