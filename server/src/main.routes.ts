import { Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

export const MainRoutes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
];
