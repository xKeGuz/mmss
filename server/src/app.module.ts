import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { MainRoutes } from './main.routes';
import { HttpExceptionFilter } from './shared/handlers/error.exception';

@Module({
  imports: [AuthModule, RouterModule.register(MainRoutes)],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
