import { IsEmail, IsString, MinLength } from 'class-validator';

export class Signup {
    email: string;

    username: string;

    password: string;
}