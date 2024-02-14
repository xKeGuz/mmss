import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { HandlersError } from '../shared/handlers/error.utils';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { BcryptUtils } from '../shared/utils/bcrypt.utils';
@Injectable()
export class AuthService {
  constructor(
    private readonly _handlersError: HandlersError,
    private readonly _prisma: PrismaService,
    private readonly _bcrypt: BcryptUtils,
  ) {}

  async login(loginDto: LoginAuthDto) {
    try {
      const { username, email, password } = loginDto;

      if (!(username || email) || !password) {
        return this._handlersError.returnErrorFieldRequired();
      }

      const findUser = await this._prisma.user.findFirst({
        where: {
          username,
          email,
        },
      });

      if (!findUser) {
        return this._handlersError.returnErrorDataNotFound({
          error: {
            message: `The user ${username || email} was not found`,
          },
          debug: true,
        });
      }

      if (!findUser.is_active) {
        return this._handlersError.returnWarning({
          error: {
            title: '⚠️ Warning: User is not active',
            message:
              'Please contact the workspace administrator to activate your account',
          },
        });
      }

      const validPassword: boolean = await this._bcrypt.matches(
        password,
        findUser.password,
      );

      if (!validPassword) {
        return this._handlersError.returnWarning({
          error: {
            message: 'Please check your credentials and try again',
            statusCode: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      return {
        response: {
          user: {
            id: findUser.user_id,
            username: findUser.username,
            email: findUser.email,
            first_name: findUser.first_name,
            middle_name: findUser.middle_name,
            last_name: findUser.last_name,
            se: findUser.second_last_name,
            last_login: findUser.last_login,
            role_id: findUser.role_id,
          },
          token: {},
          workspace: {}
        },
        title: '🟢 Success: Welcome to MMSS',
        message: 'User logged in successfully',
        valid: true,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorResponse({ error, debug: true });
    }
  }
}
