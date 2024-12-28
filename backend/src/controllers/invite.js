const User = require('../models/User');
const { isDev, testInviteCode } = require('../config/env');
const logger = require('../utils/logger');

const validateInviteCode = async (req, res) => {
  try {
    const { code } = req.body;
    logger.info(`Validating invite code: ${code}`);

    // Check for test codes in development
    if (isDev && (code === testInviteCode || code === 'TEST1234')) {
      logger.info('Using test invite code');
      return res.json({ 
        valid: true, 
        userName: code === 'TEST1234' ? 'Quick Test User' : 'Test User'
      });
    }

    const user = await User.findOne({ inviteCode: code });
    logger.info(`Found user: ${user?.name || 'none'}`);

    if (!user) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Invalid invite code' 
      });
    }

    res.json({ 
      valid: true, 
      userName: user.name 
    });
  } catch (error) {
    logger.error('Invite validation error:', error);
    res.status(500).json({ 
      valid: false, 
      message: 'Error validating invite code' 
    });
  }
};

module.exports = { validateInviteCode };
