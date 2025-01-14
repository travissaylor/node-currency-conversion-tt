import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { isValidObjectKey } from 'src/util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected readonly db: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userId = this.getUserIdFromRequest(
      context.switchToHttp().getRequest(),
    );
    const user = await this.db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }

  protected getUserIdFromRequest(req: Record<string, unknown>) {
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
