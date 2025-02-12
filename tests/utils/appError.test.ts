import AppError from "../../src/utils/app.error";

describe("AppError", () => {
  it("should create an instance of AppError with a message and status code", () => {
    const error = new AppError("Something went wrong", 400);

    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe("failed");
  });

  it("should set status to 'error!' for non-4xx status codes", () => {
    const error = new AppError("Internal server error", 500);

    expect(error.status).toBe("error! 💥");
  });

  it("should capture the stack trace", () => {
    const error = new AppError("Test error", 404);
    
    expect(error.stack).toBeDefined();
  });
});
