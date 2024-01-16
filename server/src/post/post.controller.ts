import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  getPost(
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
}
