import { jest, describe, test, expect } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../chat.js';

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

describe('Chat API', () => {
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

  test('returns 400 when message is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Message is required'
    });
  });

  test('processes message successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        message: 'test message'
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.text).toBe('Received: test message');
    expect(typeof data.timestamp).toBe('string');
  });
}); 