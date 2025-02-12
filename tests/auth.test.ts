import request from 'supertest';
import chai from 'chai';
import app from '../src/app';
import { expect } from 'chai';
import mongoose from 'mongoose';
import User from '../src/models/user.model';  

chai.should();

describe('Authentication Routes', function() {
    before(async function() {
        await mongoose.connect('mongodb://localhost:27017/test-db');
      });

    afterEach(async function() {
        await User.deleteMany(); 
    });

    after(async function() {
        await mongoose.disconnect();
  });

  describe('POST /register', function() {
    it('should register a user successfully', async function() {
      const userData = {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      };

      const res = await request(app).post('/register').send(userData);
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Registration successful!.');
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.have.property('fname').to.equal(userData.fname);
    });

    it('should return error if passwords do not match', async function() {
      const userData = {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        password: 'Password@123',
        confirmPassword: 'Password@124',  // Mismatched password
      };

      const res = await request(app).post('/register').send(userData);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Both passwords must match!');
    });

    it('should return error if required fields are missing', async function() {
      const res = await request(app).post('/register').send({ email: 'john.doe@example.com' });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('All fields are required');
    });
  });

  // Login route test
  describe('POST /login', function() {
    before(async function() {
      // Register a user first
      const userData = {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      };
      await request(app).post('/register').send(userData);
    });

    it('should log in successfully with valid credentials', async function() {
      const loginData = {
        email: 'john.doe@example.com',
        password: 'Password@123',
      };

      const res = await request(app).post('/login').send(loginData);
      
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('success');
      expect(res.body).to.have.property('token');
    });

    it('should return error if credentials are invalid', async function() {
      const loginData = {
        email: 'john.doe@example.com',
        password: 'WrongPassword@123',
      };

      const res = await request(app).post('/login').send(loginData);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid credentials');
    });

    it('should return error if email is not registered', async function() {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password@123',
      };

      const res = await request(app).post('/login').send(loginData);

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Email not registered. Please register first.');
    });
  });

  // Logout route test
  describe('POST /logout', function() {
    let userID: string;
    let token: string;

    before(async function() {
      // Register a user first
      const userData = {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      };
      const res = await request(app).post('/register').send(userData);
      userID = res.body.user._id;
      token = res.body.token;
    });

    it('should log out successfully', async function() {
      const res = await request(app)
        .post(`/logout/${userID}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Logout successful!');
    });

    it('should return error if user is not logged in', async function() {
      const res = await request(app).post('/logout/invalidID');

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Unauthorized: User not logged in or unauthorized to perform this action');
    });
  });
});
