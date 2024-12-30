import { jest } from '@jest/globals';

// Make jest available globally
global.jest = jest;

// Suppress experimental warning for ES modules
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('ExperimentalWarning')) return;
  originalWarn(...args);
}; 