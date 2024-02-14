import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HandlersError } from '../shared/handlers/error.utils';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptUtils } from '../shared/utils/bcrypt.utils';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HandlersError, PrismaService, BcryptUtils],
})
export class AuthModule {}
