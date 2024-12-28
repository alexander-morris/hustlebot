#!/bin/bash

# Create root project directory
mkdir -p hustlebot-mobile
cd hustlebot-mobile

# Create frontend structure
mkdir -p frontend/src/{components,screens,services,utils}/{Chat,Auth,Common}
mkdir -p frontend/src/components/{Chat,Auth,Common}
mkdir -p frontend/src/screens/{Landing,Chat,Waitlist}

# Create backend structure
mkdir -p backend/src/{controllers,models,routes,services,utils}

# Initialize frontend with Expo
npx create-expo-app frontend

# Initialize backend
cd backend
npm init -y
npm install express mongoose dotenv @google/generative-ai cors
cd ..

# Create frontend files
cat > frontend/src/utils/colors.js << 'EOF'
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  
  chatBubble: {
    user: '#007AFF',
    bot: '#E9E9EB',
    system: '#34C759'
  },
  
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#787880',
    inverse: '#FFFFFF'
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA'
  }
};
EOF

cat > frontend/src/screens/Landing/index.js << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';

export default function Landing() {
  return (
    <View>
      <Text>Welcome to HustleBot</Text>
    </View>
  );
}
EOF

cat > frontend/src/components/Chat/ChatUI.js << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';

export default function ChatUI() {
  return (
    <View>
      <Text>Chat Interface</Text>
    </View>
  );
}
EOF

cat > frontend/src/services/ai.js << 'EOF'
// Gemini API integration
export const sendMessage = async (message) => {
  // TODO: Implement Gemini API integration
  return { text: 'Response placeholder' };
};
EOF

# Create backend files
cat > backend/src/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
EOF

cat > backend/src/models/User.js << 'EOF'
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  inviteCode: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
EOF

cat > backend/src/controllers/invite.js << 'EOF'
const validateInviteCode = async (req, res) => {
  try {
    // TODO: Implement invite code validation
    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { validateInviteCode };
EOF

cat > backend/src/services/ai.js << 'EOF'
const { GoogleGenerativeAI } = require('@google/generative-ai');

// TODO: Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResponse = async (message) => {
  // TODO: Implement Gemini chat logic
  return { response: 'Placeholder response' };
};

module.exports = { generateResponse };
EOF

cat > backend/src/utils/logger.js << 'EOF'
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  fg: {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
  }
};

const logger = {
  error: (msg) => console.log(`${colors.fg.red}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.fg.green}${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.fg.cyan}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.fg.yellow}${msg}${colors.reset}`)
};

module.exports = logger;
EOF

# Create .env files
cat > backend/.env << 'EOF'
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hustlebot
GEMINI_API_KEY=your_api_key_here
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
*.log
EOF

echo "Project structure created successfully!"