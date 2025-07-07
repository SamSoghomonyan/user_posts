var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { JsonController, Body, Param, Get, Delete, Post, QueryParam, Patch, CurrentUser, UnauthorizedError, BadRequestError, HttpError, HttpCode } from "routing-controllers";
import { AppDataSource } from "../src/data-source.js";
import { User } from "../src/entity/User.js";
import { UserPosts } from "../src/entity/Post.js";
let PostController = class PostController {
    postRepo = AppDataSource.getRepository(UserPosts);
    async allPosts(limit, page) {
        return await this.postRepo.find({
            relations: ['user', 'comments', 'comments.user'],
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async createPost(user, body) {
        if (!user)
            throw new UnauthorizedError();
        if (!body.post?.trim()) {
            throw new BadRequestError('Post content is required');
        }
        const post = new UserPosts();
        post.post = body.post.trim();
        post.imageUrl = null; // Since you're not uploading
        post.user = user;
        const savedPost = await this.postRepo.save(post);
        const fullPost = await this.postRepo.findOne({
            where: { id: savedPost.id },
            relations: ['comments', 'comments.user', 'user'],
        });
        return fullPost;
    }
    async deletePost(id, user) {
        if (!user)
            throw new UnauthorizedError();
        const post = await this.postRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!post) {
            throw new BadRequestError('Post not found');
        }
        if (post.user.id !== user.id) {
            throw new HttpError(403, 'You are not allowed to delete this post');
        }
        await this.postRepo.delete(id);
        throw new HttpError(204);
    }
    async updatePost(id, body, user) {
        if (!user)
            throw new UnauthorizedError();
        const post = await this.postRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!post) {
            throw new BadRequestError('Post not found');
        }
        if (post.user.id !== user.id) {
            throw new HttpError(403, 'You are not allowed to edit this post');
        }
        if (body.post) {
            post.post = body.post.trim();
        }
        await this.postRepo.save(post);
        return { message: 'Post updated successfully' };
    }
};
__decorate([
    Get('/'),
    __param(0, QueryParam("limit")),
    __param(1, QueryParam("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "allPosts", null);
__decorate([
    Post('/'),
    HttpCode(201),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    Delete('/:id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
__decorate([
    Patch('/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, User]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
PostController = __decorate([
    JsonController('/posts')
], PostController);
export { PostController };
//# sourceMappingURL=PostController.js.map