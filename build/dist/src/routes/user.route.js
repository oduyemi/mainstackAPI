"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", user_controller_1.getAllUsers);
router.get("/admin", user_controller_1.getAllAdmin);
router.get("/:userID", user_controller_1.getUserById);
router.get("/:admin/:userID", user_controller_1.getAdminById);
router.put("/:userID", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.updateUser);
router.put("/:userID/role/admin", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.promoteToAdmin);
router.put("/:userID/role/user", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.demoteToUser);
router.delete("/users/:userID", auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, user_controller_1.deleteUser);
exports.default = router;
