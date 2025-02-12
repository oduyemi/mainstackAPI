import express from 'express';
import supertest from 'supertest';
import appRoutes from '../../src/routes/app.route'; 
import authRoutes from '../../src/routes/auth.route';
import productRoutes from '../../src/routes/product.route';
import userRoutes from '../../src/routes/user.route';

const app = express();
app.use(express.json());

app.use('/api/v1', appRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

export default supertest(app); 
