const pkg = require('./package.json');

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'react-hooks',
  ],
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest', 'react', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  globals: {
    Class: true,
    Event: true,
    Promise: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': false,
    '@typescript-eslint/no-empty-interface': false,
    'sort-vars': 0,
    'max-lines-per-function': 0,
    'sort-imports': 0,
    'react/no-children-prop': 0,
    'react/prop-types': 0,
    'jsx-a11y/no-autofocus': false,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
