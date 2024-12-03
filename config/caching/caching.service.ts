import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CachingService {
  constructor(private readonly RedisCache: Redis) {}

  async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await this.RedisCache.get(key);
      if (!cachedData) return null;

      return JSON.parse(cachedData) as T;
    } catch (error) {
      return null;
    }
  }

  async setAsync<T>(key: string, value: T): Promise<void> {
    try {
      const serializedData = JSON.stringify(value);
      await this.RedisCache.set(key, serializedData, 'EX', 240); // expires in 4 minutes
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeCaching(key: string): Promise<void> {
    try {
      await this.RedisCache.del(key);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.RedisCache.keys(`${pattern}*`);
      if (keys.length) {
        await this.RedisCache.del(...keys);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
