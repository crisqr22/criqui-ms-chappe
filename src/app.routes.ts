import { HealthModule } from './app/modules/health/health.module';
import { RouterModule, Routes } from 'nest-router';
import { Module } from '@nestjs/common';

const ROUTES: Routes = [
  {
    path: 'health',
    module: HealthModule,
  },
];

@Module({
  imports: [RouterModule.forRoutes(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutes {}
