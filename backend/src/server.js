const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoUri } = require('./config/env');
require('dotenv').config();
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(mongoUri)
  .then(() => logger.success('MongoDB connected successfully'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/invite', require('./routes/invite'));
app.use('/api/logs', require('./routes/logs'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

module.exports = app;
