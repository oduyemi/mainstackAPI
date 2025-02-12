"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const app_test_1 = __importDefault(require("./app.test"));
describe("GET /api/v1", () => {
    it("should return the index route response", (done) => {
        app_test_1.default.get("/api/v1")
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done();
        });
    });
});
