module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier',
    'no-secrets',
    'simple-import-sort',
    'import',
    'module-resolver',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/no-anonymous-default-export': 'off',
        'react/prop-types': 'error',
        'no-unused-vars': 'warn',
      },
    },
  ],

  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  globals: {
    __DEV__: true,
  },
};
