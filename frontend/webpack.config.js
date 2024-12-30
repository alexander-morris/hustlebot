const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@react-navigation']
    }
  }, argv);
  
  // Set the entry point for web
  config.entry = {
    app: path.resolve(__dirname, 'src/index.web.js')
  };

  // Add custom rules here
  config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }
  });

  // Configure static file serving
  config.devServer = {
    ...config.devServer,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
    },
    historyApiFallback: true,
    hot: true,
    port: 19006,
    host: 'localhost',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  };

  // Ensure the output configuration is correct
  config.output = {
    ...config.output,
    publicPath: '/',
    filename: 'static/js/[name].bundle.js',
    chunkFilename: 'static/js/[name].chunk.js'
  };

  // Fix manifest plugin issue
  const manifestPluginIndex = config.plugins.findIndex(plugin => plugin.constructor.name === 'WebpackManifestPlugin');
  if (manifestPluginIndex !== -1) {
    config.plugins.splice(manifestPluginIndex, 1);
  }

  return config;
}; 