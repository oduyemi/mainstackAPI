import { expect } from 'chai';
import supertest from './app.test';

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
    supertest.post("/api/v1/register")
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should log in a user", (done) => {
    const loginData = { email: "johndoe@example.com", password: "Password123!" };
    supertest.post("/api/v1/login")
      .send(loginData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should log out a user", (done) => {
    supertest.post("/api/v1/logout/1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
