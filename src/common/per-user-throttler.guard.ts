import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        throw new UnauthorizedException('Invalid authorization header');
      }
      return authorization[1];
    }

    throw new UnauthorizedException('Authorization header not found');
  }
}
