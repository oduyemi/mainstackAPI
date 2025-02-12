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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const product_model_1 = __importDefault(require("../../src/models/product.model"));
describe('Product Controller', () => {
    describe('GET /products', () => {
        it('should fetch all active products', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/products');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        }));
        it('should apply filters for category and price range', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/products?category=Electronics&price_min=100&price_max=500');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every((product) => product.price >= 100 && product.price <= 500)).toBe(true);
        }));
    });
    describe('GET /products/:id', () => {
        it('should fetch a product by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.default.create({
                name: 'Test Product',
                desc: 'Test description',
                img: 'test.jpg',
                price: 100,
                category: 'Electronics',
                quantity: 10,
            });
            const response = yield (0, supertest_1.default)(app_1.default).get(`/products/${product._id}`);
            expect(response.status).toBe(200);
            expect(response.body.product.name).toBe('Test Product');
        }));
        it('should return a 404 error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/products/invalid-id');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Product not found!');
        }));
    });
    describe('POST /products', () => {
        it('should create a new product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const newProduct = {
                name: 'New Product',
                desc: 'Product description',
                img: 'new-product.jpg',
                price: 200,
                category: 'Gadgets',
                quantity: 5,
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/products').send(newProduct);
            expect(response.status).toBe(201);
            expect(response.body.name).toBe(newProduct.name);
        }));
        it('should return an error if the product already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const existingProduct = yield product_model_1.default.create({
                name: 'Existing Product',
                desc: 'Description',
                img: 'existing.jpg',
                price: 100,
                category: 'Electronics',
                quantity: 10,
            });
            const newProduct = {
                name: existingProduct.name, // Same name as the existing product
                desc: 'New Description',
                img: 'new-product.jpg',
                price: 150,
                category: 'Electronics',
                quantity: 5,
            };
            const response = yield (0, supertest_1.default)(app_1.default).post('/products').send(newProduct);
            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Product with this name already exists');
        }));
    });
    describe('PUT /products/:id', () => {
        it('should update an existing product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.default.create({
                name: 'Old Product',
                desc: 'Old description',
                img: 'old.jpg',
                price: 50,
                category: 'Toys',
                quantity: 3,
            });
            const updatedData = { price: 60 };
            const response = yield (0, supertest_1.default)(app_1.default).put(`/products/${product._id}`).send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.data.price).toBe(updatedData.price);
        }));
        it('should return a 404 error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedData = { price: 60 };
            const response = yield (0, supertest_1.default)(app_1.default).put('/products/invalid-id').send(updatedData);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Product not found!');
        }));
    });
    describe('DELETE /products/:id', () => {
        it('should soft delete a product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.default.create({
                name: 'Deletable Product',
                desc: 'Description',
                img: 'delete.jpg',
                price: 100,
                category: 'Home',
                quantity: 5,
            });
            const response = yield (0, supertest_1.default)(app_1.default).delete(`/products/${product._id}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Product deleted successfully');
        }));
        it('should return a 404 error if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).delete('/products/invalid-id');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Product not found!');
        }));
    });
});
