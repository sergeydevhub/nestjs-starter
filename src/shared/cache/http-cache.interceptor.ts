import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const server = httpAdapter.getHttpServer();

    const isGetRequest = httpAdapter
      .getRequestMethod()
      .includes('GET');

    if(!isGetRequest) return;

    return server.getRequestUrl(request);
  }
}