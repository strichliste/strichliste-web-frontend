module.exports = function(wallaby) {
  var path = require('path');
  process.env.NODE_ENV = 'test';
  process.env.NODE_PATH +=
    path.delimiter +
    path.join(__dirname, 'node_modules') +
    path.delimiter +
    path.join(__dirname, 'node_modules/react-scripts/node_modules');
  require('module').Module._initPaths();

  return {
    files: [
      { pattern: 'src/setupTests.ts', instrument: false },
      'src/**/*.+(ts|tsx|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!src/**/*.spec.ts?(x)',
    ],

    tests: ['src/**/*.spec.ts?(x)'],

    env: {
      type: 'node',
      runner: 'node',
    },

    preprocessors: {
      '**/*.js?(x)': file =>
        require('@babel/core').transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          presets: ['react-app'],
        }),
    },

    setup: wallaby => {
      const jestConfig = require('react-scripts/scripts/utils/createJestConfig')(
        p => require.resolve('react-scripts/' + p)
      );
      Object.keys(jestConfig.transform || {}).forEach(
        k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k]
      );
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest',
  };
};
