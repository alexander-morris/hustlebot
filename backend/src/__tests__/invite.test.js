const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Invite Code Validation', () => {
  it('should validate a valid invite code', async () => {
    // Create test user
    await User.create({
      name: 'Test User',
      inviteCode: 'TEST123'
    });

    const response = await request(app)
      .post('/api/invite/validate')
      .send({ code: 'TEST123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      valid: true,
      userName: 'Test User'
    });
  });

  it('should reject an invalid invite code', async () => {
    const response = await request(app)
      .post('/api/invite/validate')
      .send({ code: 'INVALID' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      valid: false,
      message: 'Invalid invite code'
    });
  });
}); 