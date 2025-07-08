import {
  JsonController,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  BadRequestError,
  CurrentUser,
  HttpError,
  HttpCode,
  NotFoundError
} from "routing-controllers";
import { AppDataSource } from "../src/data-source.js";
import { User } from "../src/entity/User.js";
import * as bcrypt from "bcrypt";
import {OpenAPI} from "routing-controllers-openapi";
import {CreateUser} from "../DTO/CreateUser.js";

@JsonController('/users')
export class UserController {
  private userRepo = AppDataSource.getRepository(User);
  @Get('/')
  @OpenAPI({
    summary: 'about user',
  })
  async me(@CurrentUser() user: User) {
    console.log('🔍 CurrentUser:', user);
    return this.userRepo.findOne({
      where: { id: user.id },
      relations: [
        'posts',
      ],
    });

  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: CreateUser,
    @CurrentUser() user: User
  ) {
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

    if (body.username) existingUser.username = body.username;
    if (body.email) existingUser.email = body.email;

    await this.userRepo.save(existingUser);

    return { message: 'User updated', user: existingUser };
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const targetUser = await this.userRepo.findOneBy({id});
    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    await this.userRepo.delete(id);
    return null
  }
}
