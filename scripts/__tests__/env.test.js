const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

describe('Environment Setup', () => {
  const originalEnv = process.env;
  const testEnvVars = {
    NODE_ENV: 'test',
    PORT: '3000',
    REACT_APP_TEST: 'test-value',
    FIREBASE_TEST: 'firebase-value',
    RANDOM_VAR: 'random-value'
  };

  beforeEach(() => {
    process.env = { ...testEnvVars };
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test('creates frontend environment file with correct variables', () => {
    require('../env');
    
    const frontendPath = path.resolve(__dirname, '../../frontend/.env');
    const expectedContent = 'NODE_ENV=test\nREACT_APP_TEST=test-value';
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      frontendPath,
      expect.stringContaining('REACT_APP_TEST=test-value')
    );
  });

  test('creates api environment file with correct variables', () => {
    require('../env');
    
    const apiPath = path.resolve(__dirname, '../../api/.env');
    const expectedContent = 'NODE_ENV=test\nPORT=3000\nFIREBASE_TEST=firebase-value';
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      apiPath,
      expect.stringContaining('FIREBASE_TEST=firebase-value')
    );
  });

  test('excludes unrelated environment variables', () => {
    require('../env');
    
    const frontendCall = fs.writeFileSync.mock.calls.find(call => 
      call[0].includes('frontend/.env')
    );
    const apiCall = fs.writeFileSync.mock.calls.find(call => 
      call[0].includes('api/.env')
    );
    
    expect(frontendCall[1]).not.toContain('RANDOM_VAR');
    expect(apiCall[1]).not.toContain('RANDOM_VAR');
  });
}); 