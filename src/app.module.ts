import * as redisStore from "cache-manager-redis-store";
import paths from "@configs/paths";
import { Module, CacheModule, CacheInterceptor, OnApplicationShutdown } from '@nestjs/common';
import { AppController } from "./app.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from '@shared/health';

const isDev = process.env.NODE_ENV.includes('dev');

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }),

    ServeStaticModule.forRoot({
      rootPath: paths.public
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: isDev,
      keepConnectionAlive: !isDev,
      retryAttempts: 4,
      retryDelay: 2000,
      entities: []
    }),

    HealthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: "CACHE_INTERCEPTOR",
      useClass: CacheInterceptor
    },
  ],
})
export class AppModule {}
