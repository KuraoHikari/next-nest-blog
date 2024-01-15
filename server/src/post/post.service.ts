import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, CreatePostResponseDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(
    userId: string,
    dto: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    const { title, slug, desc, catSlug, img } = dto;

    const post = await this.prisma.post.create({
      data: {
        userId,
        title,
        slug,
        desc,
        catSlug,
        img,
      },
    });

    return post;
  }

  findMany() {}

  detail() {}
}
