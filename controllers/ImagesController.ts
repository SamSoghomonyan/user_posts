import {
    JsonController,
    Post,
    HttpCode,
    Body,
    OnUndefined,
    UploadedFile
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import {
    SwaggerRoute,
    SwRoute,
} from '@open-template-hub/swagger-decorators';
import {CreateImages} from "../DTO/CreateImages.js";
const mySwaggerRoute = { name: 'MyRoute' } as SwaggerRoute;
@SwRoute(mySwaggerRoute)

@JsonController('/images')
export class ImagesController {
    @Post('/')
    @HttpCode(201)
    @OnUndefined(204)
    @OpenAPI({
        summary: 'Create an image with JSON',
    })
    async uploadImage(
        @Body() body: CreateImages ,
    @UploadedFile('image', { required: true }) image: Express.Multer.File
    ) {
        // console.log(body.name)
        console.log(image)
        return { message: 'Image processed' };
    }
}
