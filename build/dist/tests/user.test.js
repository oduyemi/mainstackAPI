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
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../src/models/user.model"));
describe("User Controller Tests", () => {
    let adminToken;
    let userToken;
    let adminUserId;
    let regularUserId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const adminUser = new user_model_1.default({
            fname: "Admin",
            lname: "User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
            isActive: true,
        });
        yield adminUser.save();
        adminUserId = adminUser._id.toString();
        adminToken = "Bearer <admin-jwt-token>";
        const regularUser = new user_model_1.default({
            fname: "Regular",
            lname: "User",
            email: "regular@example.com",
            password: "password123",
            role: "user",
            isActive: true,
        });
        yield regularUser.save();
        regularUserId = regularUser._id.toString();
        userToken = "Bearer <regular-user-jwt-token>";
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteMany({});
        yield mongoose_1.default.connection.close();
    }));
    test("GET /users should return all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/users")
            .set("Authorization", adminToken);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    test("GET /users/admin should return only admins", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/users/admin")
            .set("Authorization", adminToken);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.every((user) => user.role === "admin")).toBe(true);
    }));
    test("GET /users/:userID should return user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${adminUserId}`)
            .set("Authorization", adminToken);
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(adminUserId);
    }));
    test("PUT /users/:userID should update user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${regularUserId}`)
            .set("Authorization", adminToken)
            .send({ fname: "Updated", lname: "User", email: "updated@example.com" });
        expect(response.status).toBe(200);
        expect(response.body.data.fname).toBe("Updated");
    }));
    test("PUT /users/:userID/role/admin should promote user to admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${regularUserId}/role/admin`)
            .set("Authorization", adminToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User role updated to admin successfully.");
    }));
    test("PUT /users/:userID/role/user should demote admin to user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${adminUserId}/role/user`)
            .set("Authorization", adminToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Admin role updated to user successfully.");
    }));
    test("DELETE /users/:userID should deactivate user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/users/${regularUserId}`)
            .set("Authorization", adminToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User deactivated successfully.");
    }));
    test("DELETE /users/:userID should return error if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidUserID = "invaliduserID";
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/users/${invalidUserID}`)
            .set("Authorization", adminToken);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found or already deactivated.");
    }));
    test("GET /users/:userID should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidUserID = "invaliduserID";
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${invalidUserID}`)
            .set("Authorization", adminToken);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found!");
    }));
});
