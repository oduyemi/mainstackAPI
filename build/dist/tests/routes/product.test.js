"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const app_test_1 = __importDefault(require("./app.test")); // Import the test setup
describe("Product Routes", () => {
    it("should get all products", (done) => {
        app_test_1.default.get("/api/v1/products")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.be.an('array');
            done();
        });
    });
    it("should get an active product", (done) => {
        app_test_1.default.get("/api/v1/products/active")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.be.an('array');
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
        app_test_1.default.post("/api/v1/products")
            .send(newProduct)
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
    it("should update a product", (done) => {
        const updatedProduct = { price: 150 };
        app_test_1.default.put("/api/v1/products/1")
            .send(updatedProduct)
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
    it("should delete a product", (done) => {
        app_test_1.default.delete("/api/v1/products/1")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
});
