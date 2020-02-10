import {
  DiskHealthIndicator,
  TerminusEndpoint,
  TerminusOptionsFactory,
  TerminusModuleOptions, MemoryHealthIndicator, TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import paths from '@configs/paths';

export class HealthService implements TerminusOptionsFactory {
  constructor(
    private readonly diskIndicator: DiskHealthIndicator,
    private readonly memoryIndicator: MemoryHealthIndicator,
    private readonly ormIndicator: TypeOrmHealthIndicator
  ) {}

  createTerminusOptions(): Promise<TerminusModuleOptions> | TerminusModuleOptions {

    const endpoints: Array<TerminusEndpoint> = [
      {
        url: '/disk-health',
        healthIndicators: [
          async () => this.diskIndicator.checkStorage('storage', { thresholdPercent: 0.5, path: paths.disk })
        ]
      },
      {
        url: '/memory-health',
        healthIndicators: [
          async () => this.memoryIndicator.checkHeap('heap', 150 * 1024 * 1024),
          async () => this.memoryIndicator.checkRSS('rss', 150 * 1024 * 1024)
        ]
      },
      {
        url: '/orm-health',
        healthIndicators: [
          async () => this.ormIndicator.pingCheck('ping', { timeout: 1000 })
        ]
      }
    ];

    return {
      endpoints
    }
  }
}