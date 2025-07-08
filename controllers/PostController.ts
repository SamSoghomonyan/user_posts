import {
  JsonController,
  Body,
  Param,
  Get,
  Delete,
  Post,
  QueryParam,
  Patch,
  CurrentUser,
  UnauthorizedError,
  BadRequestError,
  HttpError,
  HttpCode
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { AppDataSource } from "../src/data-source.js";
import { User } from "../src/entity/User.js";
import { UserPosts } from "../src/entity/Post.js";
import {CreatePost} from "../DTO/CreatePost.js";

@JsonController('/posts')
export class PostController {

  private postRepo = AppDataSource.getRepository(UserPosts);

  @Get('/')
  @OpenAPI({
    summary: 'Get all posts',
  })
  async allPosts(
    @QueryParam("limit") limit: number,
    @QueryParam("page") page: number
  ) {
    return await this.postRepo.find({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  @Post('/')
  @OpenAPI({
    summary: 'create post',
  })
  @HttpCode(201)
  async createPost(
    @CurrentUser() user: User,
    @Body() body: CreatePost
  ) {
    if (!user) throw new UnauthorizedError();

    if (!body.post?.trim()) {
      throw new BadRequestError('CreatePost.ts content is required');
    }

    const post = new UserPosts();
    post.post = body.post.trim();
    post.imageUrl = null;
    post.user = user;

    const savedPost = await this.postRepo.save(post);
    const fullPost = await this.postRepo.findOne({
      where: { id: savedPost.id },
      relations: ['user'],
    });

    return fullPost;
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'delete post' })
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    if (!user) throw new UnauthorizedError();

    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new BadRequestError('CreatePost.ts not found');
    }

    if (post.user.id !== user.id) {
      throw new HttpError(403, 'You are not allowed to delete this post');
    }

    await this.postRepo.delete(id);
    throw new HttpError(204);
  }

  @Patch('/:id')
  @OpenAPI({
    summary: 'update post',
    requestBody: {
      content: {
        'application/json': {
          example: {
            post: 'new post content',
          }
        }
      }
    }
  })
  async updatePost(
    @Param('id') id: string,
    @Body() body: CreatePost,
    @CurrentUser() user: User
  ) {
    if (!user) throw new UnauthorizedError();

    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new BadRequestError('CreatePost.ts not found');
    }

    if (post.user.id !== user.id) {
      throw new HttpError(403, 'You are not allowed to edit this post');
    }

    if (body.post) {
      post.post = body.post.trim();
    }

    await this.postRepo.save(post);
    return { message: 'CreatePost.ts updated successfully' };
  }
}
