import app from "../../src/app"; 
import request from 'supertest';


describe('GET /', () => {
  it('should return a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to Mainstack API');
  });
});
