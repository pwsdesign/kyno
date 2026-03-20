const path = require('path');

function resolveExpoPreset() {
  try {
    return require.resolve('babel-preset-expo');
  } catch {
    const expoPackage = require.resolve('expo/package.json');
    return require.resolve('babel-preset-expo', {
      paths: [path.dirname(expoPackage)],
    });
  }
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        resolveExpoPreset(),
        {
          router: {
            root: './app',
          },
        },
      ],
    ],
  };
};
