import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, CreatePostResponseDto } from './dto/post.dto';
import { Post, Prisma } from '@prisma/client';
import {
  PaginateOptions,
  PaginatedResult,
} from 'src/prisma/dto/prisma.custom.dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(
    userId: string,
    dto: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    const { title, desc, catSlug, img } = dto;

    const slug = slugify(title);

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

  async findOneBySlug(slug: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: {
        slug: slug,
      },
      include: { comments: true },
    });
    return post;
  }

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

  async deletePostById({
    where,
    sub,
  }: {
    where: Prisma.PostWhereInput;
    sub: string;
  }) {
    await this.prisma.findOneWithAuth({ sub })(this.prisma.post, where);
    await this.prisma.post.delete({
      where: {
        id: String(where.id),
      },
    });

    return true;
  }
}
