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
import { JsonController, Post, Body, HttpError, BadRequestError, HttpCode } from 'routing-controllers';
import { AppDataSource } from "../src/data-source.js";
import { User } from "../src/entity/User.js";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
let AuthController = class AuthController {
    userRepo = AppDataSource.getRepository(User);
    async signup(body) {
        const { email, username, password } = body;
        const existingUser = await this.userRepo.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestError('Registration failed. Please try again later.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({
            email,
            username,
            password: hashedPassword,
        });
        await this.userRepo.save(user);
        return { message: 'successfully',
            user: user,
        };
    }
    async login(body) {
        const { email, password } = body;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new HttpError(401, 'Invalid credentials');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new HttpError(401, 'Invalid credentials');
        }
        const token = jwt.sign({ id: user.id, email: user.email }, 'my_secret_key', { expiresIn: '24h' });
        return { token };
    }
};
__decorate([
    Post('/signup'),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    Post('/login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = __decorate([
    JsonController('/auth')
], AuthController);
export { AuthController };
//# sourceMappingURL=AuthController.js.map