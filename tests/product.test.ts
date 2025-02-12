import request from 'supertest';
import chai from 'chai';
import app from '../src/app';
import mongoose from 'mongoose';
import Product from "../src/models/product.model"
import { expect } from 'chai';


chai.should();

describe('Product Routes', function() {
    before(async function() {
        await mongoose.connect('mongodb://localhost:27017/test-db');
      });

    afterEach(async function() {
        await Product.deleteMany(); 
    });

    after(async function() {
        await mongoose.disconnect();
  });

describe('Product API', () => {

  // Test for getting all products
  it('should get all products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // Test for getting active products
  it('should get active products', async () => {
    const res = await request(app).get('/products/active');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.every((product: any) => product.isActive === true)).to.be.true;
  });

  // Test for getting inactive products
  it('should get inactive products', async () => {
    const res = await request(app).get('/products/inactive');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.every((product: any) => product.isActive === false)).to.be.true;
  });

  // Test for getting a product by ID
  it('should get a product by ID', async () => {
    const product = await Product.create({
      name: 'Test Product',
      desc: 'Test description',
      img: 'image_url',
      price: 100,
      category: 'electronics',
      quantity: 10,
    });

    const res = await request(app).get(`/products/${product._id}`);
    expect(res.status).to.equal(200);
    expect(res.body.product.name).to.equal('Test Product');
    expect(res.body.product.desc).to.equal('Test description');
  });

  // Test for creating a new product
  it('should create a new product', async () => {
    const newProduct = {
      name: 'New Product',
      desc: 'New product description',
      img: 'new_image_url',
      price: 150,
      category: 'electronics',
      quantity: 15,
    };

    const res = await request(app)
      .post('/products')
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE') // Include valid auth token
      .send(newProduct);

    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal(newProduct.name);
    expect(res.body.desc).to.equal(newProduct.desc);
  });

  // Test for updating a product
  it('should update a product', async () => {
    const product = await Product.create({
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

    const res = await request(app)
      .put(`/products/${product._id}`)
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE')
      .send(updatedProductData);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(updatedProductData.name);
    expect(res.body.data.desc).to.equal(updatedProductData.desc);
  });

  // Test for soft deleting a product (deactivating)
  it('should deactivate a product', async () => {
    const product = await Product.create({
      name: 'Product to be deactivated',
      desc: 'To be deactivated',
      img: 'image_url',
      price: 300,
      category: 'furniture',
      quantity: 5,
    });

    const res = await request(app)
      .delete(`/products/${product._id}`)
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE');

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Product deactivated successfully');
});

  // Test for handling product not found error
  it('should return 404 when product is not found', async () => {
    const res = await request(app).get('/products/nonexistent_id');
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Product not found!');
  });

  // Test for handling missing fields during product creation
  it('should return 400 if required fields are missing', async () => {
    const invalidProduct = {
      name: 'Invalid Product',
      desc: 'No price field',
      category: 'electronics',
    };

    const res = await request(app)
      .post('/products')
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN_HERE')
      .send(invalidProduct);

    expect(res.status).to.equal(400);
    expect(res.body.message).to.include('Missing values for');
  });

})});
