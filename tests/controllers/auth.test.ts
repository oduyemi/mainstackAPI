import request from 'supertest';
import app from '../../src/app'; 
import User from '../../src/models/user.model';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

describe('Auth Controller', () => {
    describe('POST /register', () => {
        beforeEach(async () => {
          await User.deleteMany({});
        });
      
        afterAll(async () => {
          await mongoose.connection.close();
        });
      
        it('should register a new user successfully', async () => {
          const newUser = {
            fname: 'John',
            lname: 'Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            password: 'password123',
            confirmPassword: 'password123',
          };
      
          const response = await request(app).post('/register').send(newUser);
      
          expect(response.status).toBe(201);
          expect(response.body.message).toBe('Registration successful!');
          expect(response.body.token).toBeDefined();
          expect(response.body.user.email).toBe(newUser.email);
          const savedUser = await User.findOne({ email: newUser.email }).select('+password');
          expect(savedUser).not.toBeNull();
          const isPasswordHashed = await bcrypt.compare(newUser.password, savedUser!.password);
          expect(isPasswordHashed).toBe(true);
        });
      
        it('should return an error if passwords do not match', async () => {
          const newUser = {
            fname: 'John',
            lname: 'Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            password: 'password123',
            confirmPassword: 'differentpassword',
          };
      
          const response = await request(app).post('/register').send(newUser);
          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Both passwords must match!');
        });  
        it('should return an error if email is already registered', async () => {
        const existingUser = await User.create({
            fname: 'Jane',
            lname: 'Doe',
            email: 'existing@example.com',
            phone: '0987654321',
            password: 'password123', // This will be hashed by the model
          });
      
          const newUser = {
            fname: 'John',
            lname: 'Doe',
            email: 'existing@example.com', // Duplicate email
            phone: '1234567890',
            password: 'password123',
            confirmPassword: 'password123',
          };
      
          const response = await request(app).post('/register').send(newUser);
          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Email is already registered');
        });
      });      

  describe('POST /login', () => {
    beforeEach(async () => {
        await User.deleteMany({});
      });
    
      afterAll(async () => {
        await mongoose.connection.close();
    });
    it('should login the user successfully', async () => {
    const user = await User.create({
        fname: 'Jane',
        lname: 'Doe',
        email: 'jane.doe@example.com',
        phone: '0987654321',
        password: 'password123',
      });

      const response = await request(app)
        .post('/login')
        .send({ email: 'jane.doe@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('success');
      expect(response.body.token).toBeDefined();
    });

    it('should return an error if credentials are invalid', async () => {
    const response = await request(app)
        .post('/login')
        .send({ email: 'invalid@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /logout', () => {
    it('should logout the user successfully', async () => {
      const user = await User.create({
        fname: 'Jane',
        lname: 'Doe',
        email: 'jane.doe@example.com',
        phone: '0987654321',
        password: 'password123',
      });

      const loginResponse = await request(app)
        .post('/login')
        .send({ email: 'jane.doe@example.com', password: 'password123' });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful!');
    });

    it('should return an error if user is not logged in', async () => {
      const response = await request(app).post('/logout');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: User not logged in or unauthorized to perform this action');
    });
  });
});
