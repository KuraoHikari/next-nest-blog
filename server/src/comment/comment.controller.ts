import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @Post('/:postSlug')
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @GetUser('sub') sub: string,
    @Param('postSlug') postSlug: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create({ userId: sub, postSlug, dto });
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  deletePost(@Param('id') id: string, @GetUser('sub') sub: string) {
    return this.commentService.deleteCommentById({ where: { id }, sub });
  }
}
