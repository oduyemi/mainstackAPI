import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "First name is required"],
    },
    lname: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone), 
        message: "Invalid phone number format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
      validate: {
        validator: (password: string) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\s]).{8,}$/.test(password),
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    role: { 
      type: String, 
      enum: ["admin", "user"], 
      default: "user" 
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
