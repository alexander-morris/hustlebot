const fs = require('fs').promises;
const path = require('path');

async function analyzeLogs() {
  const logFile = path.join(__dirname, '../logs/app.log');
  const logs = await fs.readFile(logFile, 'utf8');
  const entries = logs.trim().split('\n').map(line => JSON.parse(line));

  // Analyze error frequency
  const errors = entries.filter(entry => entry.level === 'error');
  const errorPatterns = errors.reduce((acc, error) => {
    const key = error.message;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Find most common errors
  const commonErrors = Object.entries(errorPatterns)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Analyze response times
  const apiCalls = entries.filter(e => 
    e.message.includes('API') || 
    e.message.includes('Request')
  );

  // Generate report
  console.log('\n=== Log Analysis Report ===\n');
  console.log('Total Logs:', entries.length);
  console.log('Total Errors:', errors.length);
  console.log('\nMost Common Errors:');
  commonErrors.forEach(([error, count]) => {
    console.log(`- ${error}: ${count} occurrences`);
  });

  // Suggest improvements
  console.log('\nSuggested Improvements:');
  if (errors.length > 0) {
    console.log('1. Add error handling for common errors:');
    commonErrors.forEach(([error]) => {
      console.log(`   - Implement specific handling for: ${error}`);
    });
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    totalLogs: entries.length,
    errorCount: errors.length,
    commonErrors,
    suggestions: []
  };

  await fs.writeFile(
    path.join(__dirname, '../logs/analysis.json'),
    JSON.stringify(report, null, 2)
  );
}

// Run analysis every hour in development
if (process.env.NODE_ENV === 'development') {
  analyzeLogs().catch(console.error);
  setInterval(analyzeLogs, 3600000);
}

module.exports = analyzeLogs; 