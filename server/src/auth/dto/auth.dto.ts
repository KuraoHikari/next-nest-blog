import { createZodDto } from '@wahyubucil/nestjs-zod-openapi';
import { User } from 'src/user/dto/user.dto';
import { z } from 'zod';

export class GetAccessTokenDto extends createZodDto(
  User.omit({ username: true }),
) {}

export const HashPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password is required' }),
});

export const ComparePasswordSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password is required' }),
});
