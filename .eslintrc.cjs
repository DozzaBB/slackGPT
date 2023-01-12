module.exports = {
  extends: [
    'airbnb-base',
    'plugin:unicorn/all',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    es6: true,
  },
  plugins: [
    'unicorn',
  ],
  ignorePatterns: ['.eslintrc.js', '**/node_modules', '**/build'],
  rules: {
    // indent: 0,
    // "import/extensions": 0,
    // "import/no-extraneous-dependencies": 0,
  },
};
