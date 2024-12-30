import { jest, describe, test, expect } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../invite.js';

// Mock Firebase Admin
jest.mock('firebase-admin/app', () => ({
  default: {
    initializeApp: jest.fn(),
    getApps: jest.fn(() => []),
    cert: jest.fn()
  }
}));

jest.mock('firebase-admin/firestore', () => ({
  default: {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        add: jest.fn(() => Promise.resolve())
      }))
    }))
  }
}));

describe('Invite API', () => {
  test('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    });
  });

  test('returns 400 when email is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Email is required'
    });
  });

  test('processes invite successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com'
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Invite sent to test@example.com');
    expect(typeof data.timestamp).toBe('number');
  });
}); 