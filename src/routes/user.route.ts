import express from "express";
import { deleteUser, getAdminById, getAllAdmin, getAllUsers, getUserById, updateUser } from "../controllers/user.controller";
import { authenticateUser, checkAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getAllUsers); 
router.get("/admin", getAllAdmin);
router.get("/:userID", getUserById);
router.get("/:admin/:userID", getAdminById);
router.put("/:userID", authenticateUser, updateUser);
router.delete("/users/:userID", authenticateUser, checkAdmin, deleteUser); 

export default router;
