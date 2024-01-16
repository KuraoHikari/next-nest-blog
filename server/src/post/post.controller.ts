import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PostService } from './post.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreatePostDto, CreatePostResponseDto } from './dto/post.dto';
import { Pagination, PaginationParams } from 'src/utils/paginationParam';
import { Sorting, SortingParams } from 'src/utils/sortingParam';
import { Search, SearchParams } from 'src/utils/searchParam';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post('/')
  @ApiCreatedResponse({
    type: CreatePostResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @GetUser('sub') sub: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(sub, createPostDto);
  }

  @UseGuards(JwtGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getPosts(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['createdAt'])
    sort?: Sorting,
    @SearchParams('title') search?: Search,
  ) {
    return this.postService.findMany({
      where: search,
      orderBy: sort,
      page: { perPage: paginationParams.size, page: paginationParams.page },
    });
  }

  @UseGuards(JwtGuard)
  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  getPost(@Param('slug') slug: string) {
    return this.postService.findOneBySlug(slug);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  deletePost(@Param('id') id: string, @GetUser('sub') sub: string) {
    return this.postService.deletePostById({ where: { id }, sub });
  }
}
