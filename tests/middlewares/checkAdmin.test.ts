import request from "supertest";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import app from "../../src/app"; 


describe("checkAdmin Middleware", () => {
    it("should pass if user is an admin", async () => {
      const token = jwt.sign({ id: "123", role: "admin" }, process.env.JWT_SECRET as string);
      
      const res = await request(app)
        .get("/admin-protected-route")
        .set("Authorization", `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Admin access granted");
    });
  
    it("should return 403 if user is not an admin", async () => {
      const token = jwt.sign({ id: "123", role: "user" }, process.env.JWT_SECRET as string);
      
      const res = await request(app)
        .get("/admin-protected-route")
        .set("Authorization", `Bearer ${token}`);
      
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal("Forbidden. User is not an admin.");
    });
  
    it("should return 401 if user is not authenticated", async () => {
      const res = await request(app).get("/admin-protected-route");
  
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal("Unauthorized. User not authenticated.");
    });
  });
  