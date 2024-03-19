import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { HandlersError } from '../shared/handlers/error.utils';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { BcryptUtils } from '../shared/utils/bcrypt.utils';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly _handlersError: HandlersError,
    private readonly _prisma: PrismaService,
    private readonly _bcrypt: BcryptUtils,
    private readonly _jwtService: JwtService,
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

      const validPassword: boolean = this._bcrypt.matches(
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

      await this._prisma.user.update({
        where: {
          user_id: findUser.user_id,
        },
        data: {
          last_login: new Date(),
        },
      });

      return {
        response: {
          user: {
            id: findUser.user_id,
            username: findUser.username,
            email: findUser.email,
            first_name: findUser.first_name,
            middle_name: findUser.middle_name,
            last_name: findUser.last_name,
            second_last_name: findUser.second_last_name,
            last_login: findUser.last_login,
            role_id: findUser.role_id,
            photo_url: findUser.photo_url,
            full_name: `${findUser.first_name} ${findUser.last_name}`,
          },
          token: this._jwtService.sign(
            {
              user_id: findUser.user_id,
              username: findUser.username,
              email: findUser.email,
              role_id: findUser.role_id,
            },
            { secret: env.JWT_SECRET },
          ),
          workspace: {},
        },
        title: '🟢 Welcome to MMSS',
        message: 'User logged in successfully',
        valid: true,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorResponse({ error, debug: true });
    }
  }

  async register(data: Prisma.UserCreateInput) {
    console.log('🚀 ~ AuthService ~ register ~ data:', data);
    try {
      if (
        !data.first_name ||
        !data.last_name ||
        !data.password ||
        !data.email
      ) {
        return this._handlersError.returnErrorFieldRequired();
      }

      if (data.password.length < 8) {
        return this._handlersError.returnWarning({
          error: {
            message: 'The password must have at least 8 characters',
          },
        });
      }

      const emailExists = await this._prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (emailExists) {
        return this._handlersError.returnErrorDataAlreadyExist({
          error: {
            message: `The email ${data.email} already exists`,
          },
          debug: true,
        });
      }

      const username = await this.getUsernameFromEmail(data.email);

      const createUser = await this._prisma.user.create({
        data: {
          ...data,
          is_active: true,
          username,
          password: this._bcrypt.encode(data.password),
          photo_url: `${env.BORING_URL}/${username}`,
          UserRole: {
            connect: {
              role_id: 1,
            },
          },
        },
      });

      return {
        response: {
          createUser,
        },
        title: '🟢 Welcome to MMSS',
        message: 'User registered successfully',
        valid: true,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return this._handlersError.returnErrorResponse({ error, debug: true });
    }
  }

  async getUsernameFromEmail(email: string) {
    const regex = /^([^@]+)@/;
    const match = email.match(regex);
    return match ? match[1] : null;
  }
}
