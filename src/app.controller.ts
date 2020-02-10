import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/common';
import { SanitizeInterceptor, FormatterInterceptor } from '@shared/interceptors';

@Controller()
@UseInterceptors(
  CacheInterceptor,
  SanitizeInterceptor,
  ClassSerializerInterceptor,
  FormatterInterceptor)
export class AppController {
  constructor() {}
}
