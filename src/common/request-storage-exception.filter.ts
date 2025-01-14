import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseService } from 'src/database/database.service';

@Catch(HttpException)
export class RequestStorageExceptionFilter implements ExceptionFilter {
  constructor(protected readonly db: DatabaseService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500; // Default to 500 for unknown exceptions
    const body = exception.getResponse();

    await this.db.request.create({
      data: {
        path: request.path,
        parameters: JSON.stringify(request.query),
        body: JSON.stringify(body),
      },
    });

    response.status(status).json(body);
  }
}
