const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create environment-specific .env files
const createEnvFile = (targetPath, vars) => {
  const content = Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  fs.writeFileSync(targetPath, content);
};

// Filter environment variables based on prefix
const filterEnvVars = (prefix) => {
  return Object.fromEntries(
    Object.entries(process.env)
      .filter(([key]) => key.startsWith(prefix) || key === 'NODE_ENV')
  );
};

// Create frontend environment variables
const frontendVars = filterEnvVars('REACT_APP_');
createEnvFile(path.resolve(__dirname, '../frontend/.env'), frontendVars);

// Create API environment variables
const apiVars = filterEnvVars('FIREBASE_');
apiVars.PORT = process.env.PORT;
apiVars.NODE_ENV = process.env.NODE_ENV;
createEnvFile(path.resolve(__dirname, '../api/.env'), apiVars);

console.log('✅ Environment files created successfully'); 