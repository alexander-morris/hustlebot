const express = require('express');
const router = express.Router();
const aiService = require('../services/ai');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await aiService.generateResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router; 