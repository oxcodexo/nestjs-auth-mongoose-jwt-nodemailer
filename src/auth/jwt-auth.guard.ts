import { extractTokenFromHeader } from '@/common/utils/extract-token-from-header';
import { IUser } from '@/user/user.schema';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from 'src/common/decorators/skip-auth.decorator';
import { AppConfigService } from 'src/config/env/env.config.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private appConfigService: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: IUser = await this.jwtService.verifyAsync(token, {
        secret: this.appConfigService.jwtSecret,
      });

      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
