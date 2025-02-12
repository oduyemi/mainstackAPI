"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const app_test_1 = __importDefault(require("./app.test"));
describe("Auth Routes", () => {
    it("should register a new user", (done) => {
        const newUser = {
            fname: "John",
            lname: "Doe",
            email: "johndoe@example.com",
            phone: "1234567890",
            password: "Password123!",
            confirmPassword: "Password123!"
        };
        app_test_1.default.post("/api/v1/register")
            .send(newUser)
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
    it("should log in a user", (done) => {
        const loginData = { email: "johndoe@example.com", password: "Password123!" };
        app_test_1.default.post("/api/v1/login")
            .send(loginData)
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("token");
            done();
        });
    });
    it("should log out a user", (done) => {
        app_test_1.default.post("/api/v1/logout/1")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
});
