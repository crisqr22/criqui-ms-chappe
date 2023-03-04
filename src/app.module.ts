import { Module } from '@nestjs/common';
import { AppRoutes } from './app.routes';
import { HealthModule } from './app/modules/health/health.module';

@Module({
  imports: [AppRoutes, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
