import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock window.location
delete window.location;
window.location = {
  href: '',
  search: '',
  hash: '',
  pathname: '/',
  reload: jest.fn(),
};

// Mock Firebase
jest.mock('firebase/app', () => ({
  getApp: jest.fn(() => ({})),
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
  signInWithRedirect: jest.fn(),
  getRedirectResult: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
})); 