"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Product name must be at least 3 characters long"],
    },
    desc: {
        type: String,
        trim: true,
        maxlength: [500, "Description can't exceed 500 characters"],
    },
    img: {
        type: String,
        required: [true, "Product image is required"],
        validate: {
            validator: (v) => /^https?:\/\/(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6})?(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)*(\.(jpg|jpeg|png|webp|avif|gif|svg))$/.test(v),
            message: "Please provide a valid image URL",
        },
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price must be greater than or equal to 0"],
        validate: {
            validator: Number.isFinite,
            message: "Price must be a valid number",
        },
    },
    category: {
        type: String,
        index: true,
        required: [true, "Product category is required"],
        enum: {
            values: ["electronics", "fashion", "home", "beauty", "sports", "other"],
            message: "{VALUE} is not a valid category",
        },
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        default: 0,
        min: [0, "Quantity cannot be negative"],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Admin information is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Indexing for category and price (descending)
productSchema.index({ category: 1, price: -1 });
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
