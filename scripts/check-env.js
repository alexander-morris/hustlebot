const frontendVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const backendVars = [
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'NODE_ENV'
];

// Skip checks if running in Vercel build environment
if (process.env.VERCEL_ENV) {
  console.log('\x1b[36m%s\x1b[0m', '⚡ Running in Vercel environment');
  
  // Verify Vercel-specific environment variables
  const vercelVars = [
    'VERCEL_ENV',
    'VERCEL_URL',
    'VERCEL_REGION'
  ];
  
  const missingVercelVars = vercelVars.filter(envVar => !process.env[envVar]);
  if (missingVercelVars.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', 'Warning: Missing some Vercel environment variables:');
    missingVercelVars.forEach(envVar => {
      console.warn('\x1b[33m%s\x1b[0m', `  - ${envVar}`);
    });
  }

  // Check if we're using system environment variables
  const allVars = [...frontendVars, ...backendVars];
  const usingSystemEnv = allVars.every(envVar => 
    process.env[envVar] && process.env[envVar].startsWith('@')
  );

  if (!usingSystemEnv) {
    console.warn('\x1b[33m%s\x1b[0m', 'Warning: Some environment variables might not be using Vercel System Environment Variables (@)');
    console.warn('\x1b[33m%s\x1b[0m', 'Consider using System Environment Variables for better security');
  }

  process.exit(0);
}

// Regular environment checks for non-Vercel environments
const missingFrontendVars = frontendVars.filter(envVar => !process.env[envVar]);
const missingBackendVars = backendVars.filter(envVar => !process.env[envVar]);

if (missingFrontendVars.length > 0 || missingBackendVars.length > 0) {
  if (missingFrontendVars.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required frontend environment variables:');
    missingFrontendVars.forEach(envVar => {
      console.error('\x1b[31m%s\x1b[0m', `  - ${envVar}`);
    });
  }
  
  if (missingBackendVars.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required backend environment variables:');
    missingBackendVars.forEach(envVar => {
      console.error('\x1b[31m%s\x1b[0m', `  - ${envVar}`);
    });
  }
  
  console.error('\x1b[33m%s\x1b[0m', '\nPlease set these variables in your .env file or environment.');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✓ All required environment variables are set'); 