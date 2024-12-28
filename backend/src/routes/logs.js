const express = require('express');
const router = express.Router();
const Logger = require('../utils/logger');

router.post('/', async (req, res) => {
  try {
    const logEntry = req.body;
    await Logger.writeToFile(logEntry);
    res.status(200).send({ message: 'Log recorded' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to record log' });
  }
});

module.exports = router; 