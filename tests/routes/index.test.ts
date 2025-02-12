import { expect } from 'chai';
import supertest from './app.test'; 

describe("GET /api/v1", () => {
  it("should return the index route response", (done) => {
    supertest.get("/api/v1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
