const fs = require('fs').promises;
const path = require('path');
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m'
};

const LOG_DIR = path.join(__dirname, '../../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

class Logger {
  static async ensureLogDir() {
    try {
      await fs.mkdir(LOG_DIR, { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  static async writeToFile(entry) {
    try {
      await this.ensureLogDir();
      const logString = JSON.stringify(entry) + '\n';
      await fs.appendFile(LOG_FILE, logString);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  static async log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      message,
      args,
      source: 'backend',
      environment: process.env.NODE_ENV
    };

    // Write to file
    await this.writeToFile(entry);

    // Console output with colors
    const color = level === 'error' ? colors.red : 
                 level === 'success' ? colors.green : colors.blue;
    
    console.log(
      `${color}[${level.toUpperCase()}]${colors.reset}`,
      message,
      ...args
    );
  }

  static info(message, ...args) {
    return this.log('info', message, ...args);
  }

  static success(message, ...args) {
    return this.log('success', message, ...args);
  }

  static error(message, ...args) {
    return this.log('error', message, ...args);
  }

  static debug(...args) {
    if (process.env.NODE_ENV === 'development') {
      return this.log('debug', ...args);
    }
  }
}

module.exports = Logger;
