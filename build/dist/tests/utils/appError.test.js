"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = __importDefault(require("../../src/utils/app.error"));
describe("AppError", () => {
    it("should create an instance of AppError with a message and status code", () => {
        const error = new app_error_1.default("Something went wrong", 400);
        expect(error.message).toBe("Something went wrong");
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe("failed");
    });
    it("should set status to 'error!' for non-4xx status codes", () => {
        const error = new app_error_1.default("Internal server error", 500);
        expect(error.status).toBe("error! 💥");
    });
    it("should capture the stack trace", () => {
        const error = new app_error_1.default("Test error", 404);
        expect(error.stack).toBeDefined();
    });
});
