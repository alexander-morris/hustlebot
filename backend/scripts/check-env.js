const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
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

// Validate PORT is a number
if (isNaN(process.env.PORT)) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: PORT must be a number');
  process.exit(1);
}

// Validate NODE_ENV
const validEnvs = ['development', 'production', 'test'];
if (!validEnvs.includes(process.env.NODE_ENV)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: NODE_ENV must be one of: ${validEnvs.join(', ')}`);
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ All required environment variables are set'); 