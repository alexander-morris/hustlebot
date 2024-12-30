const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  watchFolders: [__dirname],
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    nodeModulesPaths: [__dirname + '/node_modules'],
    watchFolders: [__dirname + '/node_modules']
  },
  watcher: {
    watchman: {
      crawlSymlinks: false,
    },
  },
  maxWorkers: 4,
  transformer: {
    ...defaultConfig.transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true
      }
    }
  }
}; 