import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatHandler from './chat.js';
import healthHandler from './health.js';
import inviteHandler from './invite.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:19006', 'http://localhost:3000', 'exp://192.168.2.120:8081'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.post('/api/chat', chatHandler);
app.get('/api/health', healthHandler);
app.post('/api/invite', inviteHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 