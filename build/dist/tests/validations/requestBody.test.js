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
describe("validateRequestBody Middleware", () => {
    it("should pass if all required fields are present", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/some-route")
            .send({ name: "John", email: "john@example.com" });
        (0, chai_1.expect)(res.status).to.equal(200);
        (0, chai_1.expect)(res.body.message).to.equal("Request body is valid");
    }));
    it("should return 400 if some required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/some-route")
            .send({ name: "John" });
        (0, chai_1.expect)(res.status).to.equal(400);
        (0, chai_1.expect)(res.body.error).to.include("Missing required fields: email");
    }));
});
