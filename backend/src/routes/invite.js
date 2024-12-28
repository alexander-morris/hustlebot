const express = require('express');
const router = express.Router();
const { validateInviteCode } = require('../controllers/invite');

router.post('/validate', validateInviteCode);

module.exports = router; 