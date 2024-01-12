import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAccessTokenDto } from './dto/auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async hashPassword(password: string) {
    console.log(password);
    try {
      const hash = await argon.hash(password);
      console.log(hash);
      return {
        hash,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async compareHashPassword(password: string, email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const pwdMatch = await argon.verify(user.password, password);

      if (!pwdMatch) {
        throw new ForbiddenException('Credentials incorrect');
      }

      return {
        passwordMatch: true,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getAccessToken(dto: GetAccessTokenDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const pwdMatch = await argon.verify(user.password, dto.password);

      if (!pwdMatch) {
        throw new ForbiddenException('Credentials incorrect');
      }

      return '';
    } catch (error: any) {
      throw error;
    }
  }
}
