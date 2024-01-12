import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPublicGuard } from './guards/jwt-public.guard';
import { Request } from 'express';
import { ComparePasswordSchema, HashPasswordSchema } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtPublicGuard)
  @Get('/hash-password')
  @HttpCode(HttpStatus.OK)
  hashPassword(@Req() req: Request) {
    const validatedFields = HashPasswordSchema.safeParse(req.public);
    if (!validatedFields.success) {
      throw new UnauthorizedException();
    }

    return this.authService.hashPassword(req.public.password);
  }

  @UseGuards(JwtPublicGuard)
  @Get('/compare-hash')
  @HttpCode(HttpStatus.OK)
  compareHash(@Req() req: Request) {
    const validatedFields = ComparePasswordSchema.safeParse(req.public);
    if (!validatedFields.success) {
      throw new UnauthorizedException();
    }

    return this.authService.compareHashPassword(
      req.public.password,
      req.public.email,
    );
  }

  @UseGuards(JwtPublicGuard)
  @Get('/get-token')
  @HttpCode(HttpStatus.OK)
  getAccessToken(@Req() req: Request) {
    const validatedFields = ComparePasswordSchema.safeParse(req.public);
    if (!validatedFields.success) {
      throw new UnauthorizedException();
    }

    return this.authService.compareHashPassword(
      req.public.password,
      req.public.email,
    );
  }
}
