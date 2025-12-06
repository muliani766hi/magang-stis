import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterErrorFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.BAD_REQUEST;
    let message = 'File upload error';

    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size is too large';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'File count limit reached';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file type';
        break;
      default:
        message = exception.message;
    }

    response
      .status(status)
      .json({
        statusCode: status,
        message: message,
      });
  }
}
