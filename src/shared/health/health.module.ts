import { TerminusModule } from '@nestjs/terminus';
import { Module } from "@nestjs/common";
import { HealthService } from './health.service';

@Module({
  imports: [
    TerminusModule.forRootAsync({
      useClass: HealthService
    })
  ]
})
export class HealthModule{}