import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { db } from '../config/firebase';

const isDev = process.env.NODE_ENV === 'development';

export const generateReferralCode = async (userId) => {
  try {
    console.log('Generating referral code for user:', userId);
    
    // Generate a unique code
    const code = generateUniqueCode();
    console.log('Generated unique code:', code);
    
    // Try to save to Firestore but don't block on failure
    try {
      const app = getApp();
      const db = getFirestore(app);
      
      const docData = {
        code,
        createdBy: userId,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        used: false,
        usedBy: null
      };
      
      // Attempt to save but don't await
      addDoc(collection(db, 'referralCodes'), docData)
        .then(() => console.log('Successfully saved referral code to Firestore'))
        .catch(error => console.error('Failed to save to Firestore:', error));
    } catch (error) {
      console.error('Firestore setup error:', error);
    }
    
    return code;
  } catch (error) {
    console.error('Error generating referral code:', error);
    const tempCode = generateUniqueCode();
    console.log('Returning temporary code due to error:', tempCode);
    return tempCode;
  }
};

export function generateUniqueCode() {
  // Generate a code format: XXXX-XXXX-XXXX
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 3;
  const segmentLength = 4;
  
  let code = '';
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segmentLength; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < segments - 1) code += '-';
  }
  
  return code;
}

export const isValidReferralCode = async (code) => {
  if (!code) return false;
  
  // Handle development mode test codes
  if (isDev && (code === 'TEST123' || code === 'TEST1234')) {
    console.log('Development mode: Accepting test code:', code);
    return true;
  }
  
  try {
    const referralsRef = collection(db, 'referralCodes');
    const q = query(referralsRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No matching referral code found');
      return false;
    }
    
    const referral = querySnapshot.docs[0].data();
    const now = new Date();
    
    // Check if code is expired or used
    if (referral.used || (referral.expiresAt && referral.expiresAt.toDate() < now)) {
      console.log('Referral code is', referral.used ? 'used' : 'expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating referral code:', error);
    // In development mode, be more lenient with errors
    if (isDev) {
      console.warn('Development mode: Allowing code despite error');
      return true;
    }
    throw error;
  }
}; 