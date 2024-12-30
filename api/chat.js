import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'test-project',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'test@example.com',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? 
          process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
          'test-key'
      })
    });
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Only try to store in Firestore if we have a valid Firebase connection
    if (getApps().length) {
      const db = getFirestore();
      await db.collection('messages').add({
        text: message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      text: `Received: ${message}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 