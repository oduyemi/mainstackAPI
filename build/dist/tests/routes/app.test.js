"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const app_route_1 = __importDefault(require("../../src/routes/app.route"));
const auth_route_1 = __importDefault(require("../../src/routes/auth.route"));
const product_route_1 = __importDefault(require("../../src/routes/product.route"));
const user_route_1 = __importDefault(require("../../src/routes/user.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1', app_route_1.default);
app.use('/api/v1', auth_route_1.default);
app.use('/api/v1/products', product_route_1.default);
app.use('/api/v1/users', user_route_1.default);
exports.default = (0, supertest_1.default)(app);
