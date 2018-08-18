let compilerOptions = require('./tsconfig.json');

compilerOptions.module = 'CommonJs';

module.exports = wallaby => ({
  compilers: { '**/*.ts?(x)': wallaby.compilers.typeScript(compilerOptions) },
  env: { type: 'node', runner: 'node' },
  files: [
    'src/spec-configs/jest-setup.js',
    'src/**/*.ts?(x)',
    '!src/**/*.spec.ts?(x)',
  ],
  tests: ['src/**/*.spec.ts?(x)'],
  testFramework: 'jest',
  bootstrap(w) {
    w.testFramework.configure(require('./package.json').jest);
  },
});
