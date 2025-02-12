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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../src/app"));
const user_model_1 = __importDefault(require("../../src/models/user.model"));
// Mock user data
const mockUser = {
    fname: "John",
    lname: "Doe",
    email: "john.doe@example.com",
    phone: "123456789",
    password: "password123",
    role: "user",
    isActive: true
};
const mockAdmin = {
    fname: "Admin",
    lname: "Super",
    email: "admin@example.com",
    phone: "987654321",
    password: "admin123",
    role: "admin",
    isActive: true
};
let token;
let userId;
let adminId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Set up a connection to the in-memory MongoDB or test database
    yield mongoose_1.default.connect("mongodb://localhost:27017/test-db");
    // Create mock users and save to the database
    const user = yield user_model_1.default.create(mockUser);
    const admin = yield user_model_1.default.create(mockAdmin);
    userId = user._id.toString();
    adminId = admin._id.toString();
    // Mock token for SuperAdmin (assume a JWT is returned from your login endpoint)
    token = "yourSuperAdminJWTTokenHere";
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
// Tests for the user controller
describe("User Controller", () => {
    // Test getAllUsers
    it("should get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/users").expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].email).toBe(mockUser.email);
    }));
    // Test getAllAdmin
    it("should get all admins", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/admins").expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].email).toBe(mockAdmin.email);
    }));
    // Test getUserById
    it("should get a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/users/${userId}`).expect(200);
        expect(response.body.data).toHaveProperty("email", mockUser.email);
    }));
    it("should return 404 for non-existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/users/1234567890`).expect(404);
        expect(response.body.message).toBe("User not found!");
    }));
    // Test getAdminById
    it("should get an admin by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/admins/${adminId}`).expect(200);
        expect(response.body.data).toHaveProperty("email", mockAdmin.email);
    }));
    it("should return 404 for non-existing admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/admins/1234567890`).expect(404);
        expect(response.body.message).toBe("Admin not found!");
    }));
    // Test updateUser
    it("should update user profile", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = { fname: "John", lname: "Updated", email: "updated@example.com" };
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData)
            .expect(200);
        expect(response.body.data.fname).toBe("John");
        expect(response.body.message).toBe("User profile updated successfully");
    }));
    it("should return 400 for missing required fields during update", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = { fname: "John" }; // Missing lname, email, phone
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData)
            .expect(400);
        expect(response.body.message).toBe("Missing required fields: lname, email, phone");
    }));
    // Test promoteToAdmin
    it("should promote user to admin (superAdmin only)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/promote/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body.message).toBe("User role updated to admin successfully.");
    }));
    it("should return 403 if user is not superAdmin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/promote/${userId}`)
            .set("Authorization", `Bearer invalidToken`)
            .expect(403);
        expect(response.body.message).toBe("Forbidden: Only superAdmins can assign the admin role.");
    }));
    // Test demoteToUser
    it("should demote admin to user (superAdmin only)", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/demote/${adminId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body.message).toBe("Admin role updated to user successfully.");
    }));
    // Test deleteUser (Deactivate user)
    it("should deactivate user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body.message).toBe("User deactivated successfully.");
    }));
    it("should return 404 when trying to deactivate non-existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/users/1234567890`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        expect(response.body.message).toBe("User not found or already deactivated.");
    }));
});
