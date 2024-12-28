const fetch = require('node-fetch');

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;
const VERIFY_URL = 'https://hcaptcha.com/siteverify';

exports.handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${token}&secret=${HCAPTCHA_SECRET}`,
    });

    const data = await response.json();
    
    if (data.success) {
      // Store verification in database to prevent token reuse
      const db = req.app.get('db');
      await db.collection('captcha_verifications').add({
        token: token,
        timestamp: new Date(),
        success: true
      });
    }

    return res.json({ success: data.success });
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}; 