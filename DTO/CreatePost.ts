import { IsString, MinLength, IsOptional, IsUrl } from 'class-validator';

export class CreatePost {
    @IsString()
    @IsOptional()
    @MinLength(10)
    post: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    imageUrl: string;
}