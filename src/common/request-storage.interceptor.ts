import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { tap } from 'rxjs/operators';
import { DatabaseService } from 'src/database/database.service';

export interface Response<T> {
  data: T;
}

@Injectable()
export class RequestStorageInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(protected readonly db: DatabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest() as Request;

    return next.handle().pipe(
      tap(async (response) => {
        await this.db.request.create({
          data: {
            path: request.path,
            parameters: JSON.stringify(request.query),
            body: JSON.stringify(response),
          },
        });
      }),
    );
  }
}
