import request from "supertest";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import app from "../../src/app"; 


describe("validateRequestBody Middleware", () => {
    it("should pass if all required fields are present", async () => {
      const res = await request(app)
        .post("/some-route")
        .send({ name: "John", email: "john@example.com" });
  
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Request body is valid");
    });
  
    it("should return 400 if some required fields are missing", async () => {
      const res = await request(app)
        .post("/some-route")
        .send({ name: "John" });
  
      expect(res.status).to.equal(400);
      expect(res.body.error).to.include("Missing required fields: email");
    });
  });
  