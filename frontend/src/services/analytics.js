import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Create a session ID when the module loads
const sessionId = Date.now().toString();

export const logUserResponse = async (questionData) => {
  try {
    const { question, response, questionIndex, isLoggedIn, userId = null } = questionData;
    
    await addDoc(collection(db, 'user_responses'), {
      question,
      response,
      questionIndex,
      timestamp: serverTimestamp(),
      userId,
      isLoggedIn,
      sessionId,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    });
  } catch (error) {
    console.error('Error logging user response:', error);
  }
}; 