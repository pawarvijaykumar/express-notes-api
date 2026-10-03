// CONCEPT: jest.mock() - asli Note/User model (jo MongoDB se baat karta hai) ki
// jagah ek FAKE version use karte hain. Isse test FAST chalte hain aur asli
// database ki zaroorat nahi padti.

process.env.JWT_SECRET = 'test-secret-key';

jest.mock('../models/User');
const User = require('../models/User');
const request = require('supertest');
const app = require('../app');

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // har test se pehle fake data reset karo
  });

  test('signup with valid data returns 201 and a token', async () => {
    User.findOne.mockResolvedValue(null); // koi existing user nahi mila
    User.create.mockResolvedValue({ _id: 'user123', email: 'test@x.com' });

    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@x.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test('signup with invalid email returns 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'not-an-email', password: 'secret123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  test('signup with short password returns 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@x.com', password: '123' });

    expect(res.status).toBe(400);
  });

  test('signup with already-registered email returns 409', async () => {
    User.findOne.mockResolvedValue({ _id: 'existing', email: 'test@x.com' });

    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@x.com', password: 'secret123' });

    expect(res.status).toBe(409);
  });

  test('login with wrong password returns 401', async () => {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    User.findOne.mockResolvedValue({ _id: 'user123', email: 'test@x.com', password: hashedPassword });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@x.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  test('login with correct credentials returns 200 and token', async () => {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    User.findOne.mockResolvedValue({ _id: 'user123', email: 'test@x.com', password: hashedPassword });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@x.com', password: 'correctpassword' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
