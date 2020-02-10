import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';

interface Response<T = any> {
  data: T
}

@Injectable()
export class FormatterInterceptor implements NestInterceptor<any, Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response> {
    return next.handle()
      .pipe(
        map(data => ({ data }))
      )
  }
}
