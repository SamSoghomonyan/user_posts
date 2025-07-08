import { IsEmail, IsString, MinLength , IsOptional } from 'class-validator';

export class CreateUser {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password: string;
}