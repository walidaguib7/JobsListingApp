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
      const cachedData = await this.cacheService.get(key);
      if (!cachedData) {
        return null;
      }
      return JSON.stringify(cachedData) as T;
    } catch (error) {
      return null;
    }
  }

  async setAsync<T>(key: string, value: T): Promise<void> {
    try {
      const serializedData = JSON.stringify(value);
      await this.cacheService.set(key, serializedData, 240); // Default TTL is 4 minutes
    } catch (error) {
      throw new BadRequestException('Failed to set data in cache.');
    }
  }

  async removeCaching(key: string): Promise<void> {
    try {
      await this.cacheService.del(key);
    } catch (error) {
      throw new BadRequestException('Failed to remove data from cache.');
    }
  }

  async removeByPattern(pattern: string): Promise<void> {
    try {
      // Fetch all keys matching the pattern
      const keys = await this.cacheService.store.keys(`${pattern}*`);

      // If there are matching keys, delete them
      if (keys.length > 0) {
        for (const key of keys) {
          await this.cacheService.del(key); // Correctly delete the key
        }
      }
    } catch (error) {
      throw new BadRequestException(
        'Failed to remove data from cache by pattern.',
      );
    }
  }
}
