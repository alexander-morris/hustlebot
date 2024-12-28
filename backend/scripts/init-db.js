require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { isDev, mongoUri } = require('../src/config/env');
const logger = require('../src/utils/logger');

const initDb = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    if (isDev) {
      // Create test user in development
      await User.findOneAndUpdate(
        { inviteCode: 'TEST123' },
        { 
          name: 'Test User',
          inviteCode: 'TEST123',
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
      logger.success('Test user created/updated');
    }

    await mongoose.disconnect();
    logger.info('Database initialization complete');
  } catch (error) {
    logger.error('Database initialization error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  initDb();
}

module.exports = initDb; 