import { Injectable } from '@nestjs/common';
import { CacheRepository } from '../../repository/cache-repository';
import { RedisService } from '../redis.service';

@Injectable()
export class RedisRepository implements CacheRepository {
  constructor(private readonly redis: RedisService) {}
  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
