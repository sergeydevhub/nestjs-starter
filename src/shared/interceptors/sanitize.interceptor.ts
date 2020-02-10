import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { sanitizeAsync } from 'class-sanitizer';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class SanitizeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    return next.handle().pipe(
      switchMap(data => sanitizeAsync(data))
    )
  }
}