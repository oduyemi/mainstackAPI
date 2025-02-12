"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = express_1.default.Router();
router.get('/', product_controller_1.getAllProducts); // eg: /products?category=electronics&minPrice=100&maxPrice=500&sortBy=price&order=asc
router.get('/active', product_controller_1.getActiveProducts);
router.get('/inactive', product_controller_1.getInactiveProducts);
router.get('/:id', product_controller_1.getProductById);
router.post('/', auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, (0, validation_middleware_1.validateRequestBody)(['name', 'desc', 'img', 'price', 'category', 'quantity']), product_controller_1.newProduct);
router.put('/:id', auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, (0, validation_middleware_1.validateRequestBody)(['name', 'desc', 'img', 'price', 'category', 'quantity']), product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authenticateUser, auth_middleware_1.checkAdmin, product_controller_1.deleteProduct);
exports.default = router;
