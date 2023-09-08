import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { error } from 'console';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new ConsoleLogger(HttpExceptionFilter.name);


  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.debug('Triggered', JSON.stringify(exception));

    const ctx = host.switchToHttp();

    const res = ctx.getResponse();
    const statusCode = exception.getStatus();

    return res.status(statusCode).json({
      status: statusCode,
      createdBy: HttpExceptionFilter.name,
      errorMessage: exception['response']['message']
        ? exception['response']['message']
        : exception.message,
    });
  }
}
