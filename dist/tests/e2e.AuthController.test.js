// import request from 'supertest';
// import { app } from '../src/app';
// import { AppDataSource } from '../src/data-source';
// import jwt from 'jsonwebtoken';
// import { User } from "../src/entity/User";
//
// describe('Auth Controller', () => {
//   let password = ''
//   let email = ''
//   let newUser:{
//     username: string,
//     password: string,
//     email: string,
//   }
//   beforeAll(async () => {
//     const randomString = Math.random().toString(36).substring(2, 10);
//     newUser = {
//       username: `user_${randomString}`,
//       email: `${randomString}@example.com`,
//       password: '123456',
//     };
//     email = newUser.email
//     password = newUser.password;
//   })
//   beforeAll(async () => {
//     await AppDataSource.initialize();
//   });
//   afterAll(async () => {
//     await AppDataSource.destroy();
//   });
//
//   describe('Sign up' , () =>{
//     it('Successful Registration', async () => {
//       const user = await request(app).post('/auth/signup').send(newUser);
//
//       expect(user.status).toBe(201);
//       expect(user.body).toHaveProperty('message', 'successfully');
//       expect(user.body.user).toEqual(
//         expect.objectContaining({
//           id: expect.any(String),
//           username: newUser.username,
//           email: newUser.email,
//           createdAt: expect.any(String),
//           updatedAt: expect.any(String),
//         })
//       );
//     });
//
//     it('Registration with Existing Email', async () => {
//       const existingUser = {
//         username: 'user_nuespgy3',
//         email: email,
//         password: '123456',
//       };
//       const user = await request(app).post('/auth/signup').send(existingUser);
//
//       expect(user.status).toBe(400);
//       expect(user.body.message).toEqual( 'Registration failed. Please try again later.');
//     });
//   });
//   describe('Auth Login', () => {
//     const userRepo = AppDataSource.getRepository(User);
//     it('Successful login', async () => {
//       const user = await request(app).post('/auth/login').send({
//         email: email,
//         password: password
//       });
//       const token = user.body.token;
//       const decoded: any = jwt.verify(token, 'my_secret_key');
//       const userInfo = await userRepo.findOneBy({ email: email });
//       expect(decoded).toHaveProperty('id');
//       expect(decoded.email).toEqual(email);
//       expect(decoded.id).toEqual(userInfo.id);
//     });
//     it('Invalid credentials', async () =>{
//       const user = await request(app).post('/auth/login').send({
//         email: email,
//         password: '123456256513',
//       })
//       expect(user.status).toBe(401);
//       expect(user.body.message).toEqual('Invalid credentials');
//     })
//     it('should return 401 for invalid email', async () =>{
//       const user = await request(app).post('/auth/login').send({
//         email: "email",
//         password: password
//       });
//       expect(user.status).toBe(401);
//       expect(user.body.message).toEqual('Invalid credentials');
//     })
//   });
// });
//
//
//
import request from 'supertest';
import { app } from '../src/app';
import { AppDataSource } from '../src/data-source';
import jwt from 'jsonwebtoken';
import { User } from "../src/entity/User";
describe('Auth Controller', () => {
    // Use 'let' for variables that will be reassigned, or 'const' for those that won't.
    // Initialize with empty strings or null if they don't have an initial value right away.
    let password = '';
    let email = '';
    let newUser; // Declared with the UserData interface
    // Use a single beforeAll for setup that only needs to happen once for the entire suite
    beforeAll(async () => {
        // Initialize AppDataSource first, as it's a prerequisite for interacting with the database
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        // Generate random user data for each test run to ensure uniqueness
        const randomString = Math.random().toString(36).substring(2, 10);
        newUser = {
            username: `user_${randomString}`,
            email: `${randomString}@example.com`,
            password: '123456', // Consistent password for testing
        };
        email = newUser.email; // Assign to top-level variables for easier access
        password = newUser.password;
    });
    afterAll(async () => {
        // Ensure the data source is destroyed after all tests are done
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });
    describe('Sign up', () => {
        // Clean up created user after signup tests if necessary, or rely on a global cleanup
        // For now, it's fine as the email is unique per run.
        it('Successful Registration', async () => {
            const response = await request(app)
                .post('/auth/signup')
                .send(newUser); // Send the unique newUser data
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'successfully');
            expect(response.body.user).toEqual(expect.objectContaining({
                id: expect.any(String),
                username: newUser.username,
                email: newUser.email,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }));
        });
        it('Registration with Existing Email', async () => {
            // Use the 'newUser' email from the successful registration above
            // This tests the "Registration with Existing Email" scenario
            const duplicateUser = {
                username: 'another_user', // Different username
                email: email, // Use the email that was just registered successfully
                password: 'password123',
            };
            const response = await request(app)
                .post('/auth/signup')
                .send(duplicateUser);
            expect(response.status).toBe(400);
            // Ensure the error message matches what your backend actually sends
            expect(response.body.message).toEqual('Registration failed. Please try again later.');
        });
    });
    describe('Auth Login', () => {
        // Get the repository instance once if used across multiple tests in this describe block
        const userRepo = AppDataSource.getRepository(User);
        it('Successful login', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                email: email,
                password: password,
            });
            expect(response.status).toBe(200); // Assuming 200 for successful login with token
            expect(response.body).toHaveProperty('token'); // Check if token exists
            const token = response.body.token;
            // Ensure your JWT secret key matches what's used in your backend
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_secret_key');
            const userInfo = await userRepo.findOneBy({ email: email });
            expect(decoded).toHaveProperty('id');
            expect(decoded.email).toEqual(email);
            // Ensure userInfo is not null before accessing its properties
            expect(userInfo).not.toBeNull();
            expect(decoded.id).toEqual(userInfo?.id); // Use optional chaining for safety
        });
        it('Invalid credentials (wrong password)', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                email: email,
                password: 'wrong_password_123', // Intentional wrong password
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('Invalid credentials');
        });
        it('should return 401 for invalid email (non-existent)', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                email: 'nonexistent@example.com', // An email that doesn't exist
                password: 'any_password',
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('Invalid credentials');
        });
        it('should return 401 for malformed email (if your backend validates it)', async () => {
            const response = await request(app).post('/auth/login').send({
                email: "email", // Malformed email
                password: password
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('Invalid credentials');
        });
    });
});
//# sourceMappingURL=e2e.AuthController.test.js.map