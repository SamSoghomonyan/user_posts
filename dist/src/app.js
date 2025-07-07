import { createExpressServer } from 'routing-controllers';
import { AuthController } from "../controllers/AuthController.js";
import { UserController } from "../controllers/UserController.js";
import { PostController } from "../controllers/PostController.js";
import { AppDataSource } from "./data-source.js";
import { User } from "./entity/User.js";
import * as jwt from 'jsonwebtoken';
export const app = createExpressServer({
    controllers: [
        AuthController,
        UserController,
        PostController,
    ],
    currentUserChecker: async (action) => {
        const authHeader = action.request.headers['authorization'];
        const token = authHeader.split(' ')[1];
        if (!token)
            return null;
        try {
            const payload = jwt.verify(token, 'my_secret_key');
            const userRepo = AppDataSource.getRepository(User);
            return userRepo.findOne({ where: { id: payload.id } });
        }
        catch (err) {
            return 'invalid token';
        }
    }
});
// app.use('/uploads', express.static(path.join(__dirname, '../uploads.js')));
//# sourceMappingURL=app.js.map