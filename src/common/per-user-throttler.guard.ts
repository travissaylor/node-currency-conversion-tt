import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { isValidObjectKey } from 'src/util';

@Injectable()
export class PerUserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    if (
      isValidObjectKey(req.headers, 'authorization') &&
      typeof req.headers.authorization === 'string'
    ) {
      const authorization = req.headers.authorization.split(' ');
      if (
        authorization.length !== 2 ||
        authorization[0].toLowerCase() !== 'bearer'
      ) {
        throw new HttpException(
          'Invalid authorization header',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return authorization[1];
    }

    throw new HttpException(
      'Authorization header not found',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
