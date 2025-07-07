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
import { JsonController, Get, Patch, Delete, Body, Param, BadRequestError, CurrentUser, HttpError, HttpCode, NotFoundError } from "routing-controllers";
import { AppDataSource } from "../src/data-source.js";
import { User } from "../src/entity/User.js";
import * as bcrypt from "bcrypt";
let UserController = class UserController {
    userRepo = AppDataSource.getRepository(User);
    async me(user) {
        return this.userRepo.findOne({
            where: { id: user.id },
            relations: [
                'posts',
                'posts.comments',
                'receivedRequests',
                'receivedRequests.sender',
                'sentRequests',
                'sentRequests.receiver',
                'receivedRequests.receiver',
            ],
        });
    }
    async update(id, body, user) {
        if (user.id !== id) {
            throw new HttpError(403, 'Unauthorized');
        }
        const existingUser = await this.userRepo.findOneBy({ id });
        if (body.password) {
            const isSame = await bcrypt.compare(body.password, existingUser.password);
            if (isSame) {
                throw new BadRequestError('New password must be different from the current password.');
            }
            existingUser.password = await bcrypt.hash(body.password, 10);
        }
        if (body.username)
            existingUser.username = body.username;
        if (body.email)
            existingUser.email = body.email;
        await this.userRepo.save(existingUser);
        return { message: 'User updated', user: existingUser };
    }
    async delete(id) {
        const targetUser = await this.userRepo.findOneBy({ id });
        if (!targetUser) {
            throw new NotFoundError('User not found');
        }
        await this.userRepo.delete(id);
        return null;
    }
};
__decorate([
    Get('/'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    Patch('/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    Delete('/:id'),
    HttpCode(204),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    JsonController('/users')
], UserController);
export { UserController };
//# sourceMappingURL=UserController.js.map