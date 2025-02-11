import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    desc?: string;
    img: string;
    price: number;
    category: string;
    quantity: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean; 
}

const ProductSchema: Schema = new Schema<IProduct>({
    name: { 
        type: String, 
        required: [true, "Product name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Product name must be at least 3 characters long"]
    },
    desc: { 
        type: String,
        trim: true,
        maxlength: [500, "Description can't exceed 500 characters"]
    },
    img: {
        type: String, 
        required: [true, "Product image is required"],
        validate: {
            validator: (v: string) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v),
            message: "Please provide a valid image URL"
        }
    },
    price: { 
        type: Number, 
        required: [true, "Product price is required"],
        min: [0, "Price must be greater than or equal to 0"],
        validate: {
            validator: Number.isFinite,
            message: "Price must be a valid number"
        }
    },
    category: { 
        type: String, 
        index: true,
        required: [true, "Product category is required"],
        enum: {
            values: ["electronics", "fashion", "home", "beauty", "sports", "other"],
            message: "{VALUE} is not a valid category"
        }
    },
    quantity: { 
        type: Number, 
        required: [true, "Product quantity is required"],
        default: 0,
        min: [0, "Quantity cannot be negative"]
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: [true, "Admin information is required"],
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true 
});

ProductSchema.index({ category: 1, price: -1 });
export default mongoose.model<IProduct>("Product", ProductSchema);
