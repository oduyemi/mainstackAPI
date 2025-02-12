import request from "supertest";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import app from "../../src/app"; 

describe("authenticateUser Middleware", () => {
  it("should pass if token is valid and user is found", async () => {
    const userId = "123";
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string);
        const res = await request(app)
        .get("/some-protected-route")
        .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property("id", userId);  
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app).get("/some-protected-route");

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal("Access token is missing");
  });

  it("should return 401 if token is invalid", async () => {
    const invalidToken = "invalidToken";
    const res = await request(app)
      .get("/some-protected-route")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal("Unauthorized");
  });

  it("should return 401 if user is not found", async () => {
    const token = jwt.sign({ id: "nonExistingUserId" }, process.env.JWT_SECRET as string);
    const res = await request(app)
      .get("/some-protected-route")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal("Invalid token");
  });
});
