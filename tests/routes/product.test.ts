import { expect } from 'chai';
import supertest from './app.test'; // Import the test setup

describe("Product Routes", () => {
  it("should get all products", (done) => {
    supertest.get("/api/v1/products")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it("should get an active product", (done) => {
    supertest.get("/api/v1/products/active")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it("should create a new product", (done) => {
    const newProduct = {
      name: "Product 1",
      desc: "This is a test product",
      img: "image_url",
      price: 100,
      category: "electronics",
      quantity: 10
    };
    supertest.post("/api/v1/products")
      .send(newProduct)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should update a product", (done) => {
    const updatedProduct = { price: 150 };
    supertest.put("/api/v1/products/1")
      .send(updatedProduct)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should delete a product", (done) => {
    supertest.delete("/api/v1/products/1")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
