import { ArgumentsHost, ExceptionFilter, BadGatewayException, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { HTTPErrorResponse } from '@shared/exceptions';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const { message } = exception;
    const { method } = request;
    const status = exception.getStatus();

    Logger.error(message, exception.stack, `${ method } ${ request.url }`);

    const errorResponse: HTTPErrorResponse = {
      message,
      status,
      method,
      timestamp: Date.now()
    };

    response.status(exception.getStatus()).json(errorResponse);
  }
}