import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

@Injectable()
export class JwtPublicGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();
    const privateKey = Buffer.from(
      this.config.get<string>('ACCESS_TOKEN_PUBLIC_KEY'),
      'base64',
    ).toString('ascii');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: privateKey,
      });

      request['public'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
