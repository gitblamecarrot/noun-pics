import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,
    //   host: process.env.REDIS_HOST || "localhost",
    //   port: Number(process.env.REDIS_PORT) || 6379,
    //   auth_pass: process.env.REDIS_PASS
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
