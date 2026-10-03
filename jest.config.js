// CONCEPT: JEST CONFIG - "npm test" chalane par Jest khud NODE_ENV=test set kar dega,
// taaki rate limiter aur baaki cheezein automatically test-mode me chalein.
process.env.NODE_ENV = 'test';

module.exports = {
  testEnvironment: 'node',
  verbose: true,
};
