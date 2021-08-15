const pkg = process.env.PKG;
if (!pkg) throw new Error('Do not use jest directly.');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/scripts/jest-setup-file.ts'],

  moduleDirectories: [`packages/${pkg}`, 'node_modules'],
  globals: {
    'ts-jest': {
      tsconfig: `packages/${pkg}/tsconfig.test.json`,
    },
  },
};
