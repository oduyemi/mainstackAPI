import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users: IUser[] = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};


export const getAllAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const administrators: IUser[] = await User.find({ role: "admin" }).select("-password");
        res.status(200).json(administrators);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving administrators", error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.params.usernID;
        const user: IUser | null = await User.findOne({ _id: userID }).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found!" });
        } else {
            res.json({ data: user });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAdminById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userID = req.params.userID;
        const admin: IUser | null = await User.findOne({ _id: userID, role: "admin" }).select("-password");

        if (!admin) {
            res.status(404).json({ message: "Admin not found!" });
        } else {
            res.json({ data: admin });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const updatedUserData: Partial<IUser> = req.body;
        const requiredFields: Array<keyof IUser> = ["fname", "lname", "email", "phone"];
        const missingFields = requiredFields.filter(
            (field) => field in updatedUserData && !updatedUserData[field]
        );

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            return; 
        }

        delete updatedUserData.role;

        if (updatedUserData.password) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userID },
            updatedUserData,
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }

        res.status(200).json({ data: updatedUser, message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const promoteToAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { userID } = req.params;

        // SuperAdmin only can change to admin role
        if (!req.user || req.user.role !== "superAdmin") {
            res.status(403).json({ message: "Forbidden: Only superAdmins can assign the admin role." });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return;
        }

        const user = await User.findById(userID);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.role === "admin") {
            res.status(400).json({ message: "This user is already an admin." });
            return;
        }

        user.role = "admin";
        await user.save();

        res.status(200).json({ message: "User role updated to admin successfully." });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const demoteToUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { userID } = req.params;
        if (!req.user || req.user.role !== "superAdmin") {
            res.status(403).json({ message: "Forbidden: Only super administrators can change the admin role to user." });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return;
        }

        const user = await User.findById(userID);
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
        await user.save();

        res.status(200).json({ message: "Admin role updated to user successfully." });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { userID } = req.params;

        // Only superAdmins can deactivate admins
        if (!req.user || (req.user.role !== "superAdmin" && req.user.role !== "admin")) {
            res.status(403).json({ message: "Forbidden: Only superAdmins or admins can deactivate user accounts." });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return;
        }

        const user = await User.findById(userID);
        if (!user || !user.isActive) {
            res.status(404).json({ message: "User not found or already deactivated." });
            return;
        }

        // SuperAdmin can deactivate other admins
        if (req.user.role === "superAdmin" && user.role === "admin") {
            user.isActive = false;
            await user.save();
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
        await user.save();

        res.status(200).json({ message: "User deactivated successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
