import { jest, describe, test, expect } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../health.js';

describe('Health Check API', () => {
  test('returns 200 with status ok', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      status: 'ok',
      timestamp: expect.any(Number)
    });
  });

  test('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    });
  });
}); 