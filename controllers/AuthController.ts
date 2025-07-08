import {
  JsonController,
  Post,
  Body,
  HttpError,
  BadRequestError,
  HttpCode
}  from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

import { AppDataSource } from "../src/data-source.js";
import { User } from "../src/entity/User.js";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Signup } from "../DTO/Signup.js";
import {Login} from "../DTO/Login.js";

@JsonController('/auth')
export class AuthController {
  private userRepo = AppDataSource.getRepository(User);

  @Post('/signup')
  @HttpCode(201)
  @OpenAPI({
    summary: 'sign up new user',
  })
  async signup(
    @Body() body: Signup) {
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

  @Post('/login')
  @OpenAPI({
    summary: 'login user' ,
  })
  async login(@Body() body: Login) {
    const { email, password } = body;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid){
      throw new HttpError(401, 'Invalid credentials');
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'my_secret_key',
      { expiresIn: '24h' }
    );

    return { token };
  }
}
