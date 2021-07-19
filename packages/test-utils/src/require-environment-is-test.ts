if (process.env.NODE_ENV !== 'test')
  throw new Error('Do not use test-utils outside of test environment.');

export const requireEnvironmentIsTest = {};
