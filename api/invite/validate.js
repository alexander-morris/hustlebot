import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    // Check if invite code exists and is valid
    const inviteRef = db.collection('referralCodes').doc(code);
    const invite = await inviteRef.get();

    if (!invite.exists) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    const inviteData = invite.data();
    const now = new Date();
    const createdAt = inviteData.createdAt.toDate();
    const validityPeriod = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

    if (now - createdAt > validityPeriod) {
      return res.status(400).json({ error: 'Invite code has expired' });
    }

    return res.status(200).json({
      valid: true,
      createdBy: inviteData.createdBy,
      createdAt: inviteData.createdAt
    });
  } catch (error) {
    console.error('Invite validation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 