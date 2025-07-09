import {
    JsonController,
    Body,
    Param,
    Get,
    Delete,
    Post,
    QueryParam,
    Patch,
    CurrentUser,
    UnauthorizedError,
    BadRequestError,
    HttpError,
    HttpCode
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import {CreateImages} from "../DTO/CreateImages.js";

@JsonController('/images')
export class ImagesController {
    @Post('/')
    @OpenAPI({
        summary: 'create Images',
    })
    @HttpCode(201)
    async createPost(@Body() body: any) {
        return { message: 'Post created'};
    }
}
