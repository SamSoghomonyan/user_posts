var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, } from 'typeorm';
let UserPosts = class UserPosts {
    id;
    post;
    imageUrl;
    likes;
    createdAt;
    updatedAt;
    isLiked;
    likedCount;
    // Corrected: Directly pass the string literal 'User'
    user;
    userId;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserPosts.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], UserPosts.prototype, "post", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], UserPosts.prototype, "imageUrl", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], UserPosts.prototype, "likes", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], UserPosts.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], UserPosts.prototype, "updatedAt", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPosts.prototype, "isLiked", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], UserPosts.prototype, "likedCount", void 0);
__decorate([
    ManyToOne('User', (user) => user.posts) // <--- This will be the change
    ,
    JoinColumn({ name: 'userId' }),
    __metadata("design:type", Function)
], UserPosts.prototype, "user", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], UserPosts.prototype, "userId", void 0);
UserPosts = __decorate([
    Entity()
], UserPosts);
export { UserPosts };
//# sourceMappingURL=Post.js.map