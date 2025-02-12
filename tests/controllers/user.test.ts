import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import User from "../../src/models/user.model";

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

let token: string;
let userId: string;
let adminId: string;

beforeAll(async () => {
    // Set up a connection to the in-memory MongoDB or test database
    await mongoose.connect("mongodb://localhost:27017/test-db");

    // Create mock users and save to the database
    const user = await User.create(mockUser);
    const admin = await User.create(mockAdmin);

    userId = user._id.toString();
    adminId = admin._id.toString();

    // Mock token for SuperAdmin (assume a JWT is returned from your login endpoint)
    token = "yourSuperAdminJWTTokenHere";
});

afterAll(async () => {
    await mongoose.disconnect();
});

// Tests for the user controller
describe("User Controller", () => {
    
    // Test getAllUsers
    it("should get all users", async () => {
        const response = await request(app).get("/users").expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].email).toBe(mockUser.email);
    });

    // Test getAllAdmin
    it("should get all admins", async () => {
        const response = await request(app).get("/admins").expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].email).toBe(mockAdmin.email);
    });

    // Test getUserById
    it("should get a user by ID", async () => {
        const response = await request(app).get(`/users/${userId}`).expect(200);
        expect(response.body.data).toHaveProperty("email", mockUser.email);
    });

    it("should return 404 for non-existing user", async () => {
        const response = await request(app).get(`/users/1234567890`).expect(404);
        expect(response.body.message).toBe("User not found!");
    });

    // Test getAdminById
    it("should get an admin by ID", async () => {
        const response = await request(app).get(`/admins/${adminId}`).expect(200);
        expect(response.body.data).toHaveProperty("email", mockAdmin.email);
    });

    it("should return 404 for non-existing admin", async () => {
        const response = await request(app).get(`/admins/1234567890`).expect(404);
        expect(response.body.message).toBe("Admin not found!");
    });

    // Test updateUser
    it("should update user profile", async () => {
        const updatedData = { fname: "John", lname: "Updated", email: "updated@example.com" };
        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData)
            .expect(200);
        expect(response.body.data.fname).toBe("John");
        expect(response.body.message).toBe("User profile updated successfully");
    });

    it("should return 400 for missing required fields during update", async () => {
        const updatedData = { fname: "John" }; // Missing lname, email, phone
        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData)
            .expect(400);
        expect(response.body.message).toBe("Missing required fields: lname, email, phone");
    });

    // Test promoteToAdmin
    it("should promote user to admin (superAdmin only)", async () => {
        const response = await request(app)
            .put(`/users/promote/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body.message).toBe("User role updated to admin successfully.");
    });

    it("should return 403 if user is not superAdmin", async () => {
        const response = await request(app)
            .put(`/users/promote/${userId}`)
            .set("Authorization", `Bearer invalidToken`)
            .expect(403);
        expect(response.body.message).toBe("Forbidden: Only superAdmins can assign the admin role.");
    });

    // Test demoteToUser
    it("should demote admin to user (superAdmin only)", async () => {
        const response = await request(app)
            .put(`/users/demote/${adminId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body.message).toBe("Admin role updated to user successfully.");
    });

    // Test deleteUser (Deactivate user)
    it("should deactivate user", async () => {
        const response = await request(app)
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body.message).toBe("User deactivated successfully.");
    });

    it("should return 404 when trying to deactivate non-existing user", async () => {
        const response = await request(app)
            .delete(`/users/1234567890`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        expect(response.body.message).toBe("User not found or already deactivated.");
    });
});
