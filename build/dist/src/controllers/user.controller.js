"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.demoteToUser = exports.promoteToAdmin = exports.updateUser = exports.getAdminById = exports.getUserById = exports.getAllAdmin = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const getAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administrators = yield user_model_1.default.find({ role: "admin" }).select("-password");
        res.status(200).json(administrators);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving administrators", error: error.message });
    }
});
exports.getAllAdmin = getAllAdmin;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.usernID;
        const user = yield user_model_1.default.findOne({ _id: userID }).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found!" });
        }
        else {
            res.json({ data: user });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.userID;
        const admin = yield user_model_1.default.findOne({ _id: userID, role: "admin" }).select("-password");
        if (!admin) {
            res.status(404).json({ message: "Admin not found!" });
        }
        else {
            res.json({ data: admin });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAdminById = getAdminById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        const updatedUserData = req.body;
        const requiredFields = ["fname", "lname", "email", "phone"];
        const missingFields = requiredFields.filter((field) => field in updatedUserData && !updatedUserData[field]);
        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            return;
        }
        delete updatedUserData.role;
        if (updatedUserData.password) {
            updatedUserData.password = yield bcrypt_1.default.hash(updatedUserData.password, 10);
        }
        const updatedUser = yield user_model_1.default.findOneAndUpdate({ _id: userID }, updatedUserData, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        res.status(200).json({ data: updatedUser, message: "User profile updated successfully" });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
const promoteToAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        // SuperAdmin only can change to admin role
        if (!req.user || req.user.role !== "superAdmin") {
            res.status(403).json({ message: "Forbidden: Only superAdmins can assign the admin role." });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return;
        }
        const user = yield user_model_1.default.findById(userID);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        if (user.role === "admin") {
            res.status(400).json({ message: "This user is already an admin." });
            return;
        }
        user.role = "admin";
        yield user.save();
        res.status(200).json({ message: "User role updated to admin successfully." });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.promoteToAdmin = promoteToAdmin;
const demoteToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        if (!req.user || req.user.role !== "superAdmin") {
            res.status(403).json({ message: "Forbidden: Only super administrators can change the admin role to user." });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return;
        }
        const user = yield user_model_1.default.findById(userID);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        if (user.role !== "admin") {
            res.status(400).json({ message: "This user is not an admin." });
            return;
        }
        if (req.user._id.toString() === userID) {
            res.status(400).json({ message: "Super administrators cannot demote themselves." });
            return;
        }
        user.role = "user";
        yield user.save();
        res.status(200).json({ message: "Admin role updated to user successfully." });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.demoteToUser = demoteToUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        // Only superAdmins can deactivate admins
        if (!req.user || (req.user.role !== "superAdmin" && req.user.role !== "admin")) {
            res.status(403).json({ message: "Forbidden: Only superAdmins or admins can deactivate user accounts." });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return;
        }
        const user = yield user_model_1.default.findById(userID);
        if (!user || !user.isActive) {
            res.status(404).json({ message: "User not found or already deactivated." });
            return;
        }
        // SuperAdmin can deactivate other admins
        if (req.user.role === "superAdmin" && user.role === "admin") {
            user.isActive = false;
            yield user.save();
            res.status(200).json({ message: "Admin deactivated successfully." });
            return;
        }
        // Admin can only deactivate users
        if (req.user.role === "admin" && user.role === "admin") {
            res.status(403).json({ message: "Admins cannot deactivate other admins." });
            return;
        }
        // Deactivate the user
        user.isActive = false;
        yield user.save();
        res.status(200).json({ message: "User deactivated successfully." });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
