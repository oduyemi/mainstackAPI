import request from 'supertest';
import app from '../../src/app'; 
import Product from '../../src/models/product.model'; 

describe('Product Controller', () => {

  describe('GET /products', () => {
    it('should fetch all active products', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should apply filters for category and price range', async () => {
      const response = await request(app).get('/products?category=Electronics&price_min=100&price_max=500');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((product: any) => product.price >= 100 && product.price <= 500)).toBe(true);
    });
  });

  describe('GET /products/:id', () => {
    it('should fetch a product by ID', async () => {
      const product = await Product.create({
        name: 'Test Product',
        desc: 'Test description',
        img: 'test.jpg',
        price: 100,
        category: 'Electronics',
        quantity: 10,
      });

      const response = await request(app).get(`/products/${product._id}`);
      expect(response.status).toBe(200);
      expect(response.body.product.name).toBe('Test Product');
    });

    it('should return a 404 error if product not found', async () => {
      const response = await request(app).get('/products/invalid-id');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found!');
    });
  });

  describe('POST /products', () => {
    it('should create a new product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        desc: 'Product description',
        img: 'new-product.jpg',
        price: 200,
        category: 'Gadgets',
        quantity: 5,
      };

      const response = await request(app).post('/products').send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newProduct.name);
    });

    it('should return an error if the product already exists', async () => {
      const existingProduct = await Product.create({
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

      const response = await request(app).post('/products').send(newProduct);
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Product with this name already exists');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update an existing product successfully', async () => {
      const product = await Product.create({
        name: 'Old Product',
        desc: 'Old description',
        img: 'old.jpg',
        price: 50,
        category: 'Toys',
        quantity: 3,
      });

      const updatedData = { price: 60 };

      const response = await request(app).put(`/products/${product._id}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.data.price).toBe(updatedData.price);
    });

    it('should return a 404 error if product not found', async () => {
      const updatedData = { price: 60 };
      const response = await request(app).put('/products/invalid-id').send(updatedData);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found!');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should soft delete a product successfully', async () => {
      const product = await Product.create({
        name: 'Deletable Product',
        desc: 'Description',
        img: 'delete.jpg',
        price: 100,
        category: 'Home',
        quantity: 5,
      });

      const response = await request(app).delete(`/products/${product._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');
    });

    it('should return a 404 error if product not found', async () => {
      const response = await request(app).delete('/products/invalid-id');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found!');
    });
  });
});
