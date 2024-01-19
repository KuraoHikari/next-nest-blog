import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PostService } from './post.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreatePostDto, CreatePostResponseDto } from './dto/post.dto';
import { Pagination, PaginationParams } from 'src/utils/paginationParam';
import { Sorting, SortingParams } from 'src/utils/sortingParam';
import { Search, SearchParams } from 'src/utils/searchParam';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CustomParseFilePipe } from 'src/utils/parse-file-pipe';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private cloudinary: CloudinaryService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('/')
  @ApiCreatedResponse({
    type: CreatePostResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ always: true }))
  async createPost(
    @GetUser('sub') sub: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(new CustomParseFilePipe(true)) file: Express.Multer.File,
  ) {
    return await this.cloudinary
      .uploadImage(file)
      .then((data) => {
        return this.postService.create(sub, createPostDto, data.secure_url);
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: err.message,
        };
      });
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

  @Post('online')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ always: true }))
  async online(
    @UploadedFile(new CustomParseFilePipe(true)) file: Express.Multer.File,
  ) {
    return await this.cloudinary
      .uploadImage(file)
      .then((data) => {
        return {
          statusCode: 200,
          data: data.secure_url,
        };
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: err.message,
        };
      });
  }
}
