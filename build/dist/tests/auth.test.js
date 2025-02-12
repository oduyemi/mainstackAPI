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
const chai_1 = __importDefault(require("chai"));
const app_1 = __importDefault(require("../src/app"));
const chai_2 = require("chai");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../src/models/user.model"));
chai_1.default.should();
describe('Authentication Routes', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect('mongodb://localhost:27017/test-db');
        });
    });
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.deleteMany();
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
        });
    });
    describe('POST /register', function () {
        it('should register a user successfully', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const userData = {
                    fname: 'John',
                    lname: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    password: 'Password@123',
                    confirmPassword: 'Password@123',
                };
                const res = yield (0, supertest_1.default)(app_1.default).post('/register').send(userData);
                (0, chai_2.expect)(res.status).to.equal(201);
                (0, chai_2.expect)(res.body.message).to.equal('Registration successful!.');
                (0, chai_2.expect)(res.body).to.have.property('token');
                (0, chai_2.expect)(res.body.user).to.have.property('fname').to.equal(userData.fname);
            });
        });
        it('should return error if passwords do not match', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const userData = {
                    fname: 'John',
                    lname: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    password: 'Password@123',
                    confirmPassword: 'Password@124', // Mismatched password
                };
                const res = yield (0, supertest_1.default)(app_1.default).post('/register').send(userData);
                (0, chai_2.expect)(res.status).to.equal(400);
                (0, chai_2.expect)(res.body.message).to.equal('Both passwords must match!');
            });
        });
        it('should return error if required fields are missing', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app_1.default).post('/register').send({ email: 'john.doe@example.com' });
                (0, chai_2.expect)(res.status).to.equal(400);
                (0, chai_2.expect)(res.body.message).to.equal('All fields are required');
            });
        });
    });
    // Login route test
    describe('POST /login', function () {
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                // Register a user first
                const userData = {
                    fname: 'John',
                    lname: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    password: 'Password@123',
                    confirmPassword: 'Password@123',
                };
                yield (0, supertest_1.default)(app_1.default).post('/register').send(userData);
            });
        });
        it('should log in successfully with valid credentials', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const loginData = {
                    email: 'john.doe@example.com',
                    password: 'Password@123',
                };
                const res = yield (0, supertest_1.default)(app_1.default).post('/login').send(loginData);
                (0, chai_2.expect)(res.status).to.equal(200);
                (0, chai_2.expect)(res.body.message).to.equal('success');
                (0, chai_2.expect)(res.body).to.have.property('token');
            });
        });
        it('should return error if credentials are invalid', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const loginData = {
                    email: 'john.doe@example.com',
                    password: 'WrongPassword@123',
                };
                const res = yield (0, supertest_1.default)(app_1.default).post('/login').send(loginData);
                (0, chai_2.expect)(res.status).to.equal(400);
                (0, chai_2.expect)(res.body.message).to.equal('Invalid credentials');
            });
        });
        it('should return error if email is not registered', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const loginData = {
                    email: 'nonexistent@example.com',
                    password: 'Password@123',
                };
                const res = yield (0, supertest_1.default)(app_1.default).post('/login').send(loginData);
                (0, chai_2.expect)(res.status).to.equal(401);
                (0, chai_2.expect)(res.body.message).to.equal('Email not registered. Please register first.');
            });
        });
    });
    // Logout route test
    describe('POST /logout', function () {
        let userID;
        let token;
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                // Register a user first
                const userData = {
                    fname: 'John',
                    lname: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    password: 'Password@123',
                    confirmPassword: 'Password@123',
                };
                const res = yield (0, supertest_1.default)(app_1.default).post('/register').send(userData);
                userID = res.body.user._id;
                token = res.body.token;
            });
        });
        it('should log out successfully', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app_1.default)
                    .post(`/logout/${userID}`)
                    .set('Authorization', `Bearer ${token}`);
                (0, chai_2.expect)(res.status).to.equal(200);
                (0, chai_2.expect)(res.body.message).to.equal('Logout successful!');
            });
        });
        it('should return error if user is not logged in', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app_1.default).post('/logout/invalidID');
                (0, chai_2.expect)(res.status).to.equal(401);
                (0, chai_2.expect)(res.body.message).to.equal('Unauthorized: User not logged in or unauthorized to perform this action');
            });
        });
    });
});
