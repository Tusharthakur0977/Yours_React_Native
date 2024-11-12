module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@app': './app',
          '@navigation': './app/features/navigation',
          '@features': './app/features',
          '@foundation': './app/foundation',
          '@internals': './app/internals',
        },
      },
    ],
  ],
};
