import { Type, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HandlersError {
  private readonly _logger = new Logger(HandlersError.name);

  public returnErrorResponse(config: configReturnError): returnErrorDto {
    const { error, debug } = config;
    if (debug) {
      this._logger.error(error);
    }
    return {
      response: error?.response ? error.response : {},
      title: error?.title ? error.title : '❌ Error: Internal server error',
      message: error?.message ? error.message : 'INTERNAL_SERVER_ERROR',
      valid: error?.valid ? error.valid : false,
      statusCode: error?.statusCode
        ? error.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  public returnErrorFieldRequired(): returnErrorDto {
    return {
      response: {},
      title: '❌ Error: Required fields',
      message: 'All fields are required',
      valid: false,
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }

  public returnErrorDataNotFound(config: configReturnError): returnErrorDto {
    const { error } = config;
    return {
      response: {},
      title: '❌ Error: Data not found',
      message: error?.message ? error.message : 'Data not found',
      valid: false,
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  public returnErrorDataAlreadyExist(config: configReturnError): returnErrorDto {
    const { error } = config;
    return {
      response: {},
      title: '❌ Error: Data already exist',
      message: error?.message ? error.message : 'Data not found',
      valid: false,
      statusCode: HttpStatus.NOT_FOUND,
    };
  }

  public returnWarning(config: configReturnError): returnErrorDto {
    const { error } = config;
    return {
      response: {},
      title: '⚠️ Warning: Check the data',
      message: error?.message ? error.message : 'Please check the data',
      valid: false,
      statusCode: error?.statusCode
        ? error.statusCode
        : HttpStatus.PARTIAL_CONTENT,
    };
  }

  public returnData(config: configReturnError): returnDataDto {
    const { error, debug } = config;
    if (debug) {
      this._logger.error(error);
    }
    return {
      data: error.response,
      logs: {
        response: error?.response ? error.response : {},
        title: error?.title ? error.title : 'Opps! Something went wrong',
        message: error?.message ? error.message : 'INTERNAL_SERVER_ERROR',
        valid: error?.valid ? error.valid : false,
        statusCode: error?.statusCode
          ? error.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  public returnErrorRepository(
    config: configReturnRepositoryError,
  ): returnErrorDto {
    const { error, className, debug } = config;
    if (debug) {
      this._logger.error(error);
    }
    return {
      response: error?.response ? error.response : {},
      title: 'Opps! Something went wrong',
      message: `[${className}] => error: ${error}`,
      valid: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

export class configReturnError {
  error: any;
  debug?: boolean = false;
}

export class configReturnRepositoryError {
  error: any;
  className: string;
  debug?: boolean = false;
}

export class returnErrorDto {
  public response: {};
  public title: string;
  public message: string;
  public valid: boolean;
  public statusCode: HttpStatus;
}

export class returnDataDto {
  public data: Type;
  public logs: returnErrorDto;
}
