"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const app_test_1 = __importDefault(require("./app.test")); // Import the test setup
describe("User Routes", () => {
    it("should get all users", (done) => {
        app_test_1.default.get("/api/v1/users")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.be.an('array');
            done();
        });
    });
    it("should get all admins", (done) => {
        app_test_1.default.get("/api/v1/users/admin")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.be.an('array');
            done();
        });
    });
    it("should get a user by ID", (done) => {
        app_test_1.default.get("/api/v1/users/1")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("data");
            done();
        });
    });
    it("should promote a user to admin", (done) => {
        app_test_1.default.put("/api/v1/users/1/role/admin")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
    it("should demote an admin to user", (done) => {
        app_test_1.default.put("/api/v1/users/1/role/user")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
    it("should update a user", (done) => {
        const updatedUser = { fname: "Updated", lname: "Name" };
        app_test_1.default.put("/api/v1/users/1")
            .send(updatedUser)
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
    it("should delete a user", (done) => {
        app_test_1.default.delete("/api/v1/users/users/1")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
});
