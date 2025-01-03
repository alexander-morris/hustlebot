const isDev = process.env.NODE_ENV === 'development';
const API_URL = 'http://localhost:3000/api';

export const sendMessage = async (message) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('AI service error:', error);
    throw error;
  }
};

export const validateInvite = async (code) => {
  try {
    if (isDev) {
      console.log('[DEV] Validating invite code:', code);
    }
    
    const response = await fetch(`${API_URL}/invite/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[DEV] Validation error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (isDev) {
      console.log('[DEV] Validation response:', data);
    }
    return data;
  } catch (error) {
    console.error('Invite validation error:', error.message);
    throw error;
  }
};
