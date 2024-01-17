import { createZodDto } from '@wahyubucil/nestjs-zod-openapi';
import { z } from 'zod';

export const Comment = z
  .object({
    desc: z.string().min(1).openapi({ description: 'Post description' }),
    userId: z.string().openapi({ description: 'Post Author' }),
    postSlug: z
      .string()
      .min(1)
      .openapi({ description: 'Slug from the post title' }),
  })
  .openapi('Comment');

export class CreateCommentDto extends createZodDto(
  Comment.omit({ userId: true, postSlug: true }),
) {}

export class CreateCommentResponseDto extends createZodDto(Comment) {}
