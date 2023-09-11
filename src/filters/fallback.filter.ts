import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
} from '@nestjs/common';
@Catch()
export class FallbackExceptionFilter implements ExceptionFilter {
  private readonly logger = new ConsoleLogger(FallbackExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    console.log(exception)

    this.logger.debug('Triggered', JSON.stringify(exception));

    return res.status(500).json({
      statusCode: 500,
      createdBy: FallbackExceptionFilter.name,
      errorMessage: exception.message
        ? exception.message
        : 'Unexpected error occured',
    });
  }
}
