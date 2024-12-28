module.exports = {
  name: 'HustleBot',
  slug: 'hustlebot',
  version: '1.0.0',
  orientation: 'portrait',
  web: {
    bundler: 'webpack',
    favicon: false
  },
  extra: {
    isDev: process.env.NODE_ENV === 'development'
  }
}; 