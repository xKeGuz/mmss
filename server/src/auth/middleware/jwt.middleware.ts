import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Next,
  Req,
  Res,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(@Req() req: Request, @Res() res: Response, @Next() next: Function) {
    const token = req.headers['authorization'];

    if (!token) {
      throw new HttpException(
        {
          response: {},
          title: '⚠️ Warning: Token not found',
          message: 'Please provide a valid token',
          valid: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req['user'] = decoded;
        next();
    } catch (error) {
        throw new HttpException(
            {
                response: {},
                title: '⚠️ Warning: Token not valid',
                message: 'The session has expired or the token is not valid',
                valid: false,
            },
            HttpStatus.UNAUTHORIZED,
        )
    }
  }
}
