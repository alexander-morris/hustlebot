const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root directory
const envVars = dotenv.config({ path: path.resolve(__dirname, '../.env') }).parsed || {};

// Debug: Log loaded environment variables (keys only)
console.log('Loaded environment variables:', Object.keys(envVars));

module.exports = async function (env, argv) {
  // Get the base Expo config
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add our environment variables
  const envKeys = Object.keys(envVars).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
    return prev;
  }, {});

  // Debug: Log webpack environment keys
  console.log('Webpack environment keys:', Object.keys(envKeys));

  // Add DefinePlugin to the existing plugins array
  config.plugins.push(
    new webpack.DefinePlugin(envKeys)
  );

  return config;
}; 