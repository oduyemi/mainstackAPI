import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User, { IUser } from "../models/user.model";

dotenv.config();

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {  
    try {
        if (!req.session?.user) {
            res.status(401).json({ message: "Unauthorized. No user session found." });
            return; 
        }

        const userID = req.session.user.userID;
        if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return; 
        }

        const user = await User.findById(userID);
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return; 
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Error during user authentication:", error);
        res.status(500).json({ message: "Internal server error during authentication." });
        return;
    }
};



export const checkAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => { 
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: "Unauthorized. User not authenticated." });
        return;  
    }

    if (user.role !== "admin") {
        res.status(403).json({ message: "Forbidden. User is not an admin." });
        return;  
    }

    next();  
};