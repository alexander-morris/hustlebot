import HCaptcha from '@hcaptcha/react-hcaptcha';

const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

export const verifyCaptcha = async (token) => {
  try {
    const response = await fetch('/api/verify-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return false;
  }
};

export { HCaptcha }; 