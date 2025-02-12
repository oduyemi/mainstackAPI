import { expect } from 'chai';
import supertest from './app.test'; // Import the test setup

describe("User Routes", () => {
  it("should get all users", (done) => {
    supertest.get("/api/v1/users")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it("should get all admins", (done) => {
    supertest.get("/api/v1/users/admin")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it("should get a user by ID", (done) => {
    supertest.get("/api/v1/users/1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("data");
        done();
      });
  });

  it("should promote a user to admin", (done) => {
    supertest.put("/api/v1/users/1/role/admin")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should demote an admin to user", (done) => {
    supertest.put("/api/v1/users/1/role/user")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should update a user", (done) => {
    const updatedUser = { fname: "Updated", lname: "Name" };
    supertest.put("/api/v1/users/1")
      .send(updatedUser)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should delete a user", (done) => {
    supertest.delete("/api/v1/users/users/1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
