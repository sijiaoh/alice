module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/scripts/jest-setup-file.ts'],

  moduleDirectories: ['packages/caroline', 'node_modules'],
  globals: {
    'ts-jest': {
      tsconfig: {
        baseUrl: 'packages/caroline',
      },
    },
  },
};
