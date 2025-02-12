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
exports.deleteProduct = exports.updateProduct = exports.newProduct = exports.getProductById = exports.getInactiveProducts = exports.getActiveProducts = exports.getAllProducts = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
// Get All Products with optional filters
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, price_min, price_max } = req.query;
        const filters = { isActive: true };
        if (category)
            filters.category = category;
        if (price_min || price_max) {
            filters.price = {};
            if (price_min)
                filters.price.$gte = Number(price_min);
            if (price_max)
                filters.price.$lte = Number(price_max);
        }
        const products = yield product_model_1.default.find(filters);
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products", error });
    }
});
exports.getAllProducts = getAllProducts;
// Get All Products (only active ones)
const getActiveProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find({ isActive: true });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});
exports.getActiveProducts = getActiveProducts;
// Get Inactive Products
const getInactiveProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find({ isActive: false });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products", error });
    }
});
exports.getInactiveProducts = getInactiveProducts;
// Get Product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found!" });
            return;
        }
        res.status(200).json({ message: "Product successfully retrived", product });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Product", error: error.message });
    }
});
exports.getProductById = getProductById;
// New Product
const newProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, desc, img, price, category, quantity } = req.body;
        const existingProduct = yield product_model_1.default.findOne({ name });
        if (existingProduct) {
            res.status(409).json({ message: "Product with this name already exists" });
            return;
        }
        // Create new product
        const product = new product_model_1.default({
            name,
            desc,
            img,
            price,
            category,
            quantity,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ message: "Error creating product", error });
    }
});
exports.newProduct = newProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const updatedProductData = req.body;
        const requiredFields = ["name", "desc", "img", "price", "category", "quantity"];
        const missingFields = requiredFields.filter(field => field in updatedProductData && !updatedProductData[field]);
        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing values for: ${missingFields.join(", ")}` });
            return;
        }
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, { $set: updatedProductData }, { new: true, runValidators: true });
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found!" });
            return;
        }
        res.status(200).json({ data: updatedProduct });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateProduct = updateProduct;
// Soft Delete/Deactivate Product
exports.deleteProduct = [
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_model_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
            if (!product)
                res.status(404).json({ message: "Product not found!" });
            res.status(200).json({ message: "Product deleted successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting product", error });
        }
    })
];
