const { exec } = require('child_process');
const open = require('open');

// Wait for the server to start
setTimeout(async () => {
  try {
    // Open Chrome with the test reference code
    await open('http://localhost:19006/?ref=TEST1234', {
      app: {
        name: open.apps.chrome,
        arguments: ['--new-window']
      }
    });
  } catch (error) {
    console.error('Failed to open browser:', error);
  }
}, 5000); // Wait 5 seconds for server to start 