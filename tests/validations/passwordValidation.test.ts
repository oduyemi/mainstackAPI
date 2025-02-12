import request from "supertest";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import app from "../../src/app"; 


describe("validatePassword Middleware", () => {
    it("should pass if password is valid", async () => {
      const res = await request(app)
        .post("/some-route")
        .send({ password: "Valid1@Password" });
  
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Password is valid");
    });
  
    it("should return 400 with a reason if password is invalid", async () => {
        const res = await request(app)
          .post("/register")
          .send({ password: "weakpass" });
      
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Password must contain uppercase, lowercase, number, and special character.");
        expect(res.body.reason).to.equal("Password failed complexity requirements"); 
      });      
      
      it("should return Mongoose validation error if middleware is bypassed", async () => {
        const invalidPassword = "invalidpass";
        const res = await request(app)
          .post("/register")
          .send({
            fname: "John",
            lname: "Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            password: invalidPassword,
            confirmPassword: invalidPassword,
          });
      
        expect(res.status).to.equal(400);
        expect(res.body.message).to.contain("Password must contain uppercase, lowercase, number, and special character.");
    });
});      