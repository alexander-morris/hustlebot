import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import env from '../config/environment';

const firebaseConfig = env.firebase;

console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey.substring(0, 8) + '...' // Log partial API key for security
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (error) {
  console.error('Error enabling persistence:', error);
}

// Verify initialization
console.log('Firebase initialized:', {
  auth: !!auth,
  db: !!db
});

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      redirect_uri: window.location.origin,
      auth_type: 'popup'
    });

    // Configure auth instance
    auth.useDeviceLanguage();

    const result = await signInWithPopup(auth, provider);
    console.log('Google sign in successful:', result);
    return {
      name: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    throw new Error(`Sign in failed: ${error.message}`);
  }
};

// Add handler for redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return {
        name: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid
      };
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
    return null;
  }
}; 