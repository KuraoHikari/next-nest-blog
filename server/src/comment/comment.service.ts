import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/comment.dto';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create({
    userId,
    postSlug,
    dto,
  }: {
    userId: string;
    postSlug: string;
    dto: CreateCommentDto;
  }): Promise<Comment> {
    const { desc } = dto;

    const post = await this.prisma.comment.create({
      data: {
        userId,
        postSlug: postSlug,
        desc,
      },
    });

    return post;
  }
}
