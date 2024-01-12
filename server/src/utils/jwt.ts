import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JWT {
  constructor(private jwt: JwtService, private config: ConfigService) {}
  async signToken(
    payload: Object,
    keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'ACCESS_TOKEN_PUBLIC_KEY',
    options: JwtSignOptions,
  ) {
    const privateKey = Buffer.from(
      String(this.config.get<string>(keyName)),
      'base64',
    ).toString('ascii');

    return this.jwt.sign(payload, {
      ...(options && options),
      algorithm: 'RS256',
      secret: privateKey,
    });
  }

  async verifyJwt<T>(
    token: string,
    keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'ACCESS_TOKEN_PUBLIC_KEY',
  ): Promise<T | null> {
    try {
      const privateKey = Buffer.from(
        this.config.get<string>(keyName),
        'base64',
      ).toString('ascii');

      const decoded = await this.jwt.verifyAsync(token, {
        secret: privateKey,
      });

      return decoded;
    } catch (error) {
      return null;
    }
  }
}
