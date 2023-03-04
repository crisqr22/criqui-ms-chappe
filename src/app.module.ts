import { Module } from '@nestjs/common';
import { AppRoutes } from './app.routes';
import { HealthModule } from './app/modules/health/health.module';
import { WebhooksModule } from './app/modules/webhooks/webhooks.module';

@Module({
  imports: [AppRoutes, HealthModule, WebhooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
