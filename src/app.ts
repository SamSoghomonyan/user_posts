import 'reflect-metadata';
import express from 'express';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'; // ✅ ADD THIS
import swaggerUi from 'swagger-ui-express';
import * as jwt from 'jsonwebtoken';
import { multer } from 'multer'
import { AuthController } from "../controllers/AuthController.js";
import { UserController } from "../controllers/UserController.js";
import { PostController } from "../controllers/PostController.js";
import { AppDataSource } from "./data-source.js";
import { User } from "./entity/User.js";

export const app = createExpressServer({
  validation: true,
  classTransformer: true,
  controllers: [
    AuthController,
    UserController,
    PostController,
  ],
  currentUserChecker: async (action) => {
    const authHeader = action.request.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return null;

    try {
      const payload: any = jwt.verify(token, 'my_secret_key');
      const userRepo = AppDataSource.getRepository(User);
      return await userRepo.findOne({ where: { id: payload.id } });
    } catch (err) {
      return null;
    }
  }
}) as express.Express;

const schemas = validationMetadatasToSchemas();

const swaggerSpec = routingControllersToSpec(
    getMetadataArgsStorage(),
    {
      controllers: [
        AuthController,
        UserController,
        PostController,
      ],
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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
