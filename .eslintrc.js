const pkg = require('./package.json');

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    'prettier',
  ],
  plugins: ['react', 'prettier', 'eslint-plugin-import', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '**/tsconfig*json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    'sort-vars': 0,
    'max-lines-per-function': 0,
    'sort-imports': 0,
    'react/no-children-prop': 0,
    'react/prop-types': 0,
    'jsx-a11y/no-autofocus': 0,
  },
};
