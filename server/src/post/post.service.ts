import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, CreatePostResponseDto } from './dto/post.dto';
import { Post, Prisma } from '@prisma/client';
import {
  PaginateOptions,
  PaginatedResult,
} from 'src/prisma/dto/prisma.custom.dto';

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

  detail() {}

  async findMany({
    where,
    orderBy,
    page,
  }: {
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationAndSearchRelevanceInput;
    page?: PaginateOptions;
  }): Promise<PaginatedResult<Post>> {
    return this.prisma.paginator({ perPage: page.perPage })(
      this.prisma.post,
      {
        where,
        orderBy,
      },
      page,
    );
  }
}
