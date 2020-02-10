import { Module, NestMiddleware, NestInterceptor, ValidationPipe, CanActivate } from '@nestjs/common';
import { HttpCacheInterceptor } from './http-cache.interceptor'

@Module({
  exports: [
    {
      provide: 'HTTP_CACHE_INTERCEPTOR',
      useClass: HttpCacheInterceptor
    }
  ]
})
export class CacheModule {}
