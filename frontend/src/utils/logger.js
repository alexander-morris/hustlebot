const isDev = process.env.NODE_ENV === 'development';
const LOG_ENDPOINT = 'http://localhost:4000/api/logs';

class Logger {
  static logs = [];
  static initialized = false;

  static async init() {
    if (this.initialized) return;
    try {
      console.log('Initializing frontend logger...');
      // Test connection to log endpoint
      if (isDev) {
        const response = await fetch(LOG_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            level: 'info', 
            message: 'Logger initialized',
            source: 'frontend'
          })
        });
        if (!response.ok) throw new Error('Logger endpoint not available');
      }
      this.initialized = true;
      console.log('Frontend logger initialized successfully');
    } catch (error) {
      console.error('Logger initialization failed:', error.message);
      console.error('Full error:', error);
      // Fall back to console-only logging
      this.initialized = true;
    }
  }

  static async log(level, message, data = {}) {
    if (!this.initialized) await this.init();
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      source: 'frontend',
      environment: isDev ? 'development' : 'production'
    };

    // Store locally
    this.logs.push(logEntry);

    // Send to backend in development
    if (isDev && this.initialized) {
      try {
        await fetch(LOG_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEntry)
        });
      } catch (error) {
        console.error('Failed to send log:', error);
      }
    }

    // Also log to console in development
    if (isDev) {
      console[level](`[${level.toUpperCase()}]`, message, data);
    }
  }

  static info(message, data) {
    return this.log('info', message, data);
  }

  static error(message, data) {
    return this.log('error', message, data);
  }

  static debug(message, data) {
    if (isDev) {
      return this.log('debug', message, data);
    }
  }

  static getLogs() {
    return this.logs;
  }
}

export default Logger; 