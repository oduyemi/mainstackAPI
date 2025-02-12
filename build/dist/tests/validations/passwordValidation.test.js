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
const chai_1 = require("chai");
const app_1 = __importDefault(require("../../src/app"));
describe("validatePassword Middleware", () => {
    it("should pass if password is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/some-route")
            .send({ password: "Valid1@Password" });
        (0, chai_1.expect)(res.status).to.equal(200);
        (0, chai_1.expect)(res.body.message).to.equal("Password is valid");
    }));
    it("should return 400 with a reason if password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/register")
            .send({ password: "weakpass" });
        (0, chai_1.expect)(res.status).to.equal(400);
        (0, chai_1.expect)(res.body.message).to.equal("Password must contain uppercase, lowercase, number, and special character.");
        (0, chai_1.expect)(res.body.reason).to.equal("Password failed complexity requirements");
    }));
    it("should return Mongoose validation error if middleware is bypassed", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidPassword = "invalidpass";
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/register")
            .send({
            fname: "John",
            lname: "Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            password: invalidPassword,
            confirmPassword: invalidPassword,
        });
        (0, chai_1.expect)(res.status).to.equal(400);
        (0, chai_1.expect)(res.body.message).to.contain("Password must contain uppercase, lowercase, number, and special character.");
    }));
});
