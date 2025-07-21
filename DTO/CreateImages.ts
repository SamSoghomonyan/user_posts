import {IsUrl,IsString,IsOptional} from 'class-validator';

export class CreateImages {
    @IsUrl()
    @IsOptional()
    ImagesURL: string;
    @IsOptional()
    @IsString()
    name: string
}