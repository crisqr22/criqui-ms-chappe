import { HealthModule } from './app/modules/health/health.module';
import { RouterModule, Routes } from 'nest-router';
import { Module } from '@nestjs/common';
import { WebhooksRoutes } from './app/modules/webhooks/routes/webhooks.routes';
import { WebhooksModule } from './app/modules/webhooks/webhooks.module';

const ROUTES: Routes = [
  {
    path: 'health',
    module: HealthModule,
  },
  {
    path: 'v1',
    children: [
      {
        path: WebhooksRoutes.ROOT,
        module: WebhooksModule,
      },
    ],
  },
];

@Module({
  imports: [RouterModule.forRoutes(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutes {}
