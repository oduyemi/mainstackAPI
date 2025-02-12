import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../src/models/user.model"; 

describe("User Controller Tests", () => {
    let adminToken: string;
    let userToken: string;
    let adminUserId: string;
    let regularUserId: string;

    beforeAll(async () => {
        const adminUser = new User({
            fname: "Admin",
            lname: "User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
            isActive: true,
        });
        await adminUser.save();
        adminUserId = adminUser._id.toString();
        adminToken = "Bearer <admin-jwt-token>"; 

        const regularUser = new User({
            fname: "Regular",
            lname: "User",
            email: "regular@example.com",
            password: "password123",
            role: "user",
            isActive: true,
        });
        await regularUser.save();
        regularUserId = regularUser._id.toString();
        userToken = "Bearer <regular-user-jwt-token>";
    });

    afterAll(async () => {
        await User.deleteMany({}); 
        await mongoose.connection.close();
    });

    test("GET /users should return all users", async () => {
        const response = await request(app)
            .get("/users")
            .set("Authorization", adminToken);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("GET /users/admin should return only admins", async () => {
        const response = await request(app)
            .get("/users/admin")
            .set("Authorization", adminToken);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.every((user:any) => user.role === "admin")).toBe(true);
    });

    test("GET /users/:userID should return user by ID", async () => {
        const response = await request(app)
            .get(`/users/${adminUserId}`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(adminUserId);
    });

    test("PUT /users/:userID should update user", async () => {
        const response = await request(app)
            .put(`/users/${regularUserId}`)
            .set("Authorization", adminToken)
            .send({ fname: "Updated", lname: "User", email: "updated@example.com" });

        expect(response.status).toBe(200);
        expect(response.body.data.fname).toBe("Updated");
    });

    test("PUT /users/:userID/role/admin should promote user to admin", async () => {
        const response = await request(app)
            .put(`/users/${regularUserId}/role/admin`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User role updated to admin successfully.");
    });

    test("PUT /users/:userID/role/user should demote admin to user", async () => {
        const response = await request(app)
            .put(`/users/${adminUserId}/role/user`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Admin role updated to user successfully.");
    });

    test("DELETE /users/:userID should deactivate user", async () => {
        const response = await request(app)
            .delete(`/users/${regularUserId}`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User deactivated successfully.");
    });

    test("DELETE /users/:userID should return error if user not found", async () => {
        const invalidUserID = "invaliduserID";
        const response = await request(app)
            .delete(`/users/${invalidUserID}`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found or already deactivated.");
    });

    test("GET /users/:userID should return 404 if user not found", async () => {
        const invalidUserID = "invaliduserID";
        const response = await request(app)
            .get(`/users/${invalidUserID}`)
            .set("Authorization", adminToken);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found!");
    });
});
