import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import Redis from 'ioredis';

@Module({
  providers: [CachingService, Redis],
  exports: [CachingService],
})
export class CachingModule {}
