"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const user_model_1 = __importDefault(require("../../src/models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
describe('Auth Controller', () => {
    describe('POST /register', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_model_1.default.deleteMany({});
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
        }));
        it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                fname: 'John',
                lname: 'Doe',
                email: 'johndoe@example.com',
                phone: '1234567890',
                password: 'password123',
                confirmPassword: 'password123',
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/register').send(newUser);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Registration successful!');
            expect(response.body.token).toBeDefined();
            expect(response.body.user.email).toBe(newUser.email);
            const savedUser = yield user_model_1.default.findOne({ email: newUser.email }).select('+password');
            expect(savedUser).not.toBeNull();
            const isPasswordHashed = yield bcryptjs_1.default.compare(newUser.password, savedUser.password);
            expect(isPasswordHashed).toBe(true);
        }));
        it('should return an error if passwords do not match', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                fname: 'John',
                lname: 'Doe',
                email: 'johndoe@example.com',
                phone: '1234567890',
                password: 'password123',
                confirmPassword: 'differentpassword',
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/register').send(newUser);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Both passwords must match!');
        }));
        it('should return an error if email is already registered', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingUser = yield user_model_1.default.create({
                fname: 'Jane',
                lname: 'Doe',
                email: 'existing@example.com',
                phone: '0987654321',
                password: 'password123', // This will be hashed by the model
            });
            const newUser = {
                fname: 'John',
                lname: 'Doe',
                email: 'existing@example.com', // Duplicate email
                phone: '1234567890',
                password: 'password123',
                confirmPassword: 'password123',
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/register').send(newUser);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email is already registered');
        }));
    });
    describe('POST /login', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_model_1.default.deleteMany({});
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
        }));
        it('should login the user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.create({
                fname: 'Jane',
                lname: 'Doe',
                email: 'jane.doe@example.com',
                phone: '0987654321',
                password: 'password123',
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/login')
                .send({ email: 'jane.doe@example.com', password: 'password123' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('success');
            expect(response.body.token).toBeDefined();
        }));
        it('should return an error if credentials are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/login')
                .send({ email: 'invalid@example.com', password: 'wrongpassword' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        }));
    });
    describe('POST /logout', () => {
        it('should logout the user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_model_1.default.create({
                fname: 'Jane',
                lname: 'Doe',
                email: 'jane.doe@example.com',
                phone: '0987654321',
                password: 'password123',
            });
            const loginResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/login')
                .send({ email: 'jane.doe@example.com', password: 'password123' });
            const token = loginResponse.body.token;
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/logout')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout successful!');
        }));
        it('should return an error if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post('/logout');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized: User not logged in or unauthorized to perform this action');
        }));
    });
});
