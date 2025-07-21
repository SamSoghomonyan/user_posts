// swagger.ts or swagger.js
import 'reflect-metadata';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import fs from 'fs';
import path from 'path';
import { AuthController } from './controllers/AuthController.js';
import { UserController } from './controllers/UserController.js';
import { PostController } from './controllers/PostController.js';

const schemas = validationMetadatasToSchemas();

export const swaggerSpec = routingControllersToSpec(
    getMetadataArgsStorage(),
    {
        controllers: [AuthController, UserController, PostController],
    },
    {
        info: {
            title: 'My App API',
            version: '1.0.0',
        },
        security: [{ bearerAuth: [] }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas,
        },
    }
);

fs.writeFileSync(
    path.resolve('./swagger.json'),
    JSON.stringify(swaggerSpec, null, 2),
    'utf-8'
);

console.log('✅ swagger.json generated');
