"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_middleware_1.validateRequestBody)(["fname", "lname", "email", "phone", "password", "confirmPassword"]), validation_middleware_1.validatePassword, auth_controller_1.registerUser);
router.post("/login", (0, validation_middleware_1.validateRequestBody)(["email", "password"]), auth_controller_1.login);
router.post("/logout/:userID", auth_controller_1.logout);
exports.default = router;
