import { Module } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { RedisRepository } from './redis/repository/redis-repository';
import { CacheRepository } from './repository/cache-repository';
import { RedisService } from './redis/redis.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    { provide: CacheRepository, useClass: RedisRepository },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
