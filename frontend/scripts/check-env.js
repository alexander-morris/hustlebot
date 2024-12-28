const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required environment variables:');
  missingVars.forEach(envVar => {
    console.error('\x1b[31m%s\x1b[0m', `  - ${envVar}`);
  });
  console.error('\x1b[33m%s\x1b[0m', '\nPlease set these variables in your .env file or environment.');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ All required environment variables are set'); 