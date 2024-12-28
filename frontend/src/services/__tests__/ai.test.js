import { sendMessage, validateInvite } from '../ai';

global.fetch = jest.fn();

describe('AI Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('sends message to API', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: 'Test response' })
      })
    );

    const response = await sendMessage('Hello');
    expect(response).toEqual({ response: 'Test response' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' })
      })
    );
  });

  it('handles API errors correctly', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    await expect(sendMessage('Hello')).rejects.toThrow('Network response was not ok');
  });

  it('validates invite code', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ valid: true, userName: 'Test User' })
      })
    );

    const response = await validateInvite('TEST123');
    expect(response).toEqual({ valid: true, userName: 'Test User' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/invite/validate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ code: 'TEST123' })
      })
    );
  });

  it('handles invalid invite codes', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Invalid invite code' })
      })
    );

    await expect(validateInvite('INVALID')).rejects.toThrow('Invalid invite code');
  });
}); 