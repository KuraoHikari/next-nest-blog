import { createZodDto } from '@wahyubucil/nestjs-zod-openapi';
import { z } from 'zod';

export const Post = z
  .object({
    title: z.string().min(1).max(256).openapi({ description: 'Blog title' }),
    slug: z
      .string()
      .min(1)
      .openapi({ description: 'Slug from the post title' }),
    desc: z.string().min(1).openapi({ description: 'Post description' }),
    img: z.optional(z.string().openapi({ description: 'Post banner' })),
    views: z.number().min(0).openapi({ description: 'Post view count' }),
    catSlug: z.string().min(1).openapi({ description: 'Post category' }),
    userId: z.string().openapi({ description: 'Post Author' }),
  })
  .openapi('Post');

export class CreatePostDto extends createZodDto(
  Post.omit({ views: true, userId: true }),
) {}

export class CreatePostResponseDto extends createZodDto(Post) {}
