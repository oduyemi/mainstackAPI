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
const chai_1 = __importDefault(require("chai"));
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../src/models/product.model"));
const chai_2 = require("chai");
chai_1.default.should();
describe('Product Routes', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect('mongodb://localhost:27017/test-db');
        });
    });
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield product_model_1.default.deleteMany();
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
        });
    });
    describe('Product API', () => {
        // Test for getting all products
        it('should get all products', () => __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/products');
            (0, chai_2.expect)(res.status).to.equal(200);
            (0, chai_2.expect)(res.body).to.be.an('array');
        }));
        // Test for getting active products
        it('should get active products', () => __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/products/active');
            (0, chai_2.expect)(res.status).to.equal(200);
            (0, chai_2.expect)(res.body).to.be.an('array');
            (0, chai_2.expect)(res.body.every((product) => product.isActive === true)).to.be.true;
        }));
        // Test for getting inactive products
        it('should get inactive products', () => __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/products/inactive');
            (0, chai_2.expect)(res.status).to.equal(200);
            (0, chai_2.expect)(res.body).to.be.an('array');
            (0, chai_2.expect)(res.body.every((product) => product.isActive === false)).to.be.true;
        }));
        // Test for getting a product by ID
        it('should get a product by ID', () => __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.default.create({
                name: 'Test Product',
                desc: 'Test description',
                img: 'image_url',
                price: 100,
                category: 'electronics',
                quantity: 10,
            });
            const res = yield (0, supertest_1.default)(app_1.default).get(`/products/${product._id}`);
            (0, chai_2.expect)(res.status).to.equal(200);
            (0, chai_2.expect)(res.body.product.name).to.equal('Test Product');
            (0, chai_2.expect)(res.body.product.desc).to.equal('Test description');
        }));
        // Test for creating a new product
        it('should create a new product', () => __awaiter(this, void 0, void 0, function* () {
            const newProduct = {
                name: 'New Product',
                desc: 'New product description',
                img: 'new_image_url',
                price: 150,
                category: 'electronics',
                quantity: 15,
            };
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/products')
                .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE') // Include valid auth token
                .send(newProduct);
            (0, chai_2.expect)(res.status).to.equal(201);
            (0, chai_2.expect)(res.body.name).to.equal(newProduct.name);
            (0, chai_2.expect)(res.body.desc).to.equal(newProduct.desc);
        }));
        // Test for updating a product
        it('should update a product', () => __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.default.create({
                name: 'Old Product',
                desc: 'Old description',
                img: 'old_image_url',
                price: 200,
                category: 'electronics',
                quantity: 5,
            });
            const updatedProductData = {
                name: 'Updated Product',
                desc: 'Updated description',
                img: 'updated_image_url',
                price: 250,
                category: 'electronics',
                quantity: 7,
            };
            const res = yield (0, supertest_1.default)(app_1.default)
                .put(`/products/${product._id}`)
                .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE')
                .send(updatedProductData);
            (0, chai_2.expect)(res.status).to.equal(200);
            (0, chai_2.expect)(res.body.data.name).to.equal(updatedProductData.name);
            (0, chai_2.expect)(res.body.data.desc).to.equal(updatedProductData.desc);
        }));
        // Test for soft deleting a product (deactivating)
        it('should deactivate a product', () => __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.default.create({
                name: 'Product to be deactivated',
                desc: 'To be deactivated',
                img: 'image_url',
                price: 300,
                category: 'furniture',
                quantity: 5,
            });
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete(`/products/${product._id}`)
                .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE');
            (0, chai_2.expect)(res.status).to.equal(200);
            (0, chai_2.expect)(res.body.message).to.equal('Product deactivated successfully');
        }));
        // Test for handling product not found error
        it('should return 404 when product is not found', () => __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/products/nonexistent_id');
            (0, chai_2.expect)(res.status).to.equal(404);
            (0, chai_2.expect)(res.body.message).to.equal('Product not found!');
        }));
        // Test for handling missing fields during product creation
        it('should return 400 if required fields are missing', () => __awaiter(this, void 0, void 0, function* () {
            const invalidProduct = {
                name: 'Invalid Product',
                desc: 'No price field',
                category: 'electronics',
            };
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/products')
                .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE')
                .send(invalidProduct);
            (0, chai_2.expect)(res.status).to.equal(400);
            (0, chai_2.expect)(res.body.message).to.include('Missing values for');
        }));
    });
});
