import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter {
  private readonly _logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const result: any | string = exception.getResponse();
    const ip =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    if (statusCode > 300) {
      this._logger.warn(
        `[${request.method}]: ${request.url} status: ${statusCode} - By ${ip}`,
      );
    } else {
      this._logger.verbose(
        `[${request.method}]: ${request.url} status: ${statusCode} - By ${ip}`,
      );
    }

    response.status(statusCode).json({
      response: result?.response ? result.response : {},
      title: result?.title ? result.title : '❌ Error: Internal server error',
      message: result?.message ? result.message : 'INTERNAL_SERVER_ERROR',
      valid: result?.valid ? result.valid : false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

export class ExceptionFormat {
  responses: object;
  message: string;
}
