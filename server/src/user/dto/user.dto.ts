import { createZodDto } from '@wahyubucil/nestjs-zod-openapi';
import { z } from 'zod';

export const User = z
  .object({
    email: z.string().email().openapi({ description: 'User valid email' }),
    password: z
      .string()
      .min(6, 'Password is too short')
      .openapi({ description: 'Display name of the user' }),
    username: z.string().min(1, 'Value is too short'),
  })
  .openapi('User');

export class CreateUserDto extends createZodDto(
  User.extend({
    passwordConfirm: z.string({
      required_error: 'Please confirm your password',
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }),
) {}

export class CreateUserResponseDto extends createZodDto(User) {}
