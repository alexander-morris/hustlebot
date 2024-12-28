const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  isDev,
  testInviteCode: isDev ? 'TEST123' : undefined,
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hustlebot',
  geminiApiKey: process.env.GEMINI_API_KEY
}; 