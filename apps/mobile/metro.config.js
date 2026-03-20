const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Tell expo-router where the app directory is (monorepo fix)
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the monorepo root for changes in shared packages
config.watchFolders = [monorepoRoot];

// Resolve modules from both the project and root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
