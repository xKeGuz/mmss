import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiDefaultResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiDefaultResponse({
    type: LoginAuthDto,
  })
  @ApiBody({ type: LoginAuthDto })
  @Post('login')
  async create(@Body() loginDto: LoginAuthDto) {
    const { response, title, message, valid, statusCode } =
      await this.authService.login(loginDto);

    throw new HttpException({ response, title, message, valid }, statusCode);
  }
}
