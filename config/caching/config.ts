import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import * as dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';
dotenv.configDotenv({ path: '.env' });
export const RedisConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
};
