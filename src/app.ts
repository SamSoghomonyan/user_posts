// import 'reflect-metadata';
// import express from 'express';
// import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
// import { routingControllersToSpec } from 'routing-controllers-openapi';
// import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
// import swaggerUi from 'swagger-ui-express';
// import * as jwt from 'jsonwebtoken';
// import { AuthController } from "../controllers/AuthController.js";
// import { UserController } from "../controllers/UserController.js";
// import { PostController } from "../controllers/PostController.js";
// import { AppDataSource } from "./data-source.js";
// import { User } from "./entity/User.js";
// import {Images} from "./entity/Images.js";
// import {ImagesController} from "../controllers/ImagesController.js";
//
// export const app = createExpressServer({
//   validation: true,
//   classTransformer: true,
//   controllers: [
//     AuthController,
//     UserController,
//     PostController,
//     ImagesController,
//   ],
//   currentUserChecker: async (action) => {
//     const authHeader = action.request.headers['authorization'];
//     const token = authHeader?.split(' ')[1];
//     if (!token) return null;
//
//     try {
//       const payload: any = jwt.verify(token, 'my_secret_key');
//       const userRepo = AppDataSource.getRepository(User);
//       return await userRepo.findOne({ where: { id: payload.id } });
//     } catch (err) {
//       return null;
//     }
//   }
// }) as express.Express;
//
// const schemas = validationMetadatasToSchemas();
//
// const swaggerSpec = routingControllersToSpec(
//     getMetadataArgsStorage(),
//     {
//       controllers: [
//         AuthController,
//         UserController,
//         PostController,
//       ],
//     },
//     {
//       info: {
//         title: 'My App API',
//         version: '1.0.0',
//       },
//       security: [{ bearerAuth: [] }],
//       components: {
//         securitySchemes: {
//           bearerAuth: {
//             type: 'http',
//             scheme: 'bearer',
//             bearerFormat: 'JWT',
//           },
//         },
//         schemas,
//       },
//     }
// );
//
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


import 'reflect-metadata';
import express from 'express';
import multer from 'multer';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import swaggerUi from 'swagger-ui-express';
import * as jwt from 'jsonwebtoken';
import { AuthController } from "../controllers/AuthController.js";
import { UserController } from "../controllers/UserController.js";
import { PostController } from "../controllers/PostController.js";
import { AppDataSource } from "./data-source.js";
import { User } from "./entity/User.js";
import { Images } from "./entity/Images.js";
import { ImagesController } from "../controllers/ImagesController.js";

// 🔥 Configure multer
const upload = multer({ dest: 'uploads/' }); // or your custom storage

const app = express();

// ✅ Required middleware BEFORE routing-controllers
app.use(upload.single('file')); // This enables req.file
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Create routing-controllers app
const expressApp = createExpressServer({
  validation: true,
  classTransformer: true,
  controllers: [
    AuthController,
    UserController,
    PostController,
    ImagesController,
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
        ImagesController, // 👈 Don't forget this one here too
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

// ✅ Swagger setup
expressApp.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { expressApp as app };
