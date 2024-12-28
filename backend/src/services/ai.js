const { GoogleGenerativeAI } = require('@google/generative-ai');

// TODO: Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResponse = async (message) => {
  // TODO: Implement Gemini chat logic
  return { response: 'Placeholder response' };
};

module.exports = { generateResponse };
