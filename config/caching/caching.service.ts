import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await this.cacheService.get<T>(key);
      if (!cachedData) return null;
      return JSON.stringify(cachedData) as T;
    } catch (error) {
      console.error(`Error retrieving cache for key ${key}:`, error);
      return null;
    }
  }

  async setAsync<T>(key: string, value: T, ttl: number = 240): Promise<void> {
    try {
      const serializedData = JSON.stringify(value);
      await this.cacheService.set(key, serializedData); // ttl in seconds
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error);
      throw new BadRequestException('Failed to set cache.');
    }
  }

  async removeCaching(key: string): Promise<void> {
    try {
      await this.cacheService.del(key);
    } catch (error) {
      console.error(`Error removing cache for key ${key}:`, error);
      throw new BadRequestException('Failed to remove cache.');
    }
  }

  async removeByPattern(pattern: string): Promise<void> {
    try {
      // Assuming your CacheManager supports the keys command
      const keys = await this.cacheService.store.keys(`${pattern}*`);
      if (keys && keys.length) {
        await Promise.all(keys.map((key) => this.cacheService.del(key)));
      }
    } catch (error) {
      console.error(`Error removing cache by pattern ${pattern}:`, error);
      throw new BadRequestException('Failed to remove cache by pattern.');
    }
  }
}
