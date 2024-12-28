import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getApp } from 'firebase/app';

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