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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../../src/app"));
describe("checkAdmin Middleware", () => {
    it("should pass if user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ id: "123", role: "admin" }, process.env.JWT_SECRET);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/admin-protected-route")
            .set("Authorization", `Bearer ${token}`);
        (0, chai_1.expect)(res.status).to.equal(200);
        (0, chai_1.expect)(res.body.message).to.equal("Admin access granted");
    }));
    it("should return 403 if user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ id: "123", role: "user" }, process.env.JWT_SECRET);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/admin-protected-route")
            .set("Authorization", `Bearer ${token}`);
        (0, chai_1.expect)(res.status).to.equal(403);
        (0, chai_1.expect)(res.body.message).to.equal("Forbidden. User is not an admin.");
    }));
    it("should return 401 if user is not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/admin-protected-route");
        (0, chai_1.expect)(res.status).to.equal(401);
        (0, chai_1.expect)(res.body.message).to.equal("Unauthorized. User not authenticated.");
    }));
});
