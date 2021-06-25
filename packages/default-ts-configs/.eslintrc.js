module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    // https://github.com/benmosher/eslint-plugin-import/issues/1485#issuecomment-535351922
    'import/resolver': { typescript: {} },
  },
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  rules: {
    'no-void': 'off',
    quotes: ['error', 'single'],

    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/order': ['error', { alphabetize: { order: 'asc' } }],

    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    '@typescript-eslint/await-thenable': 'error',
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/promise-function-async': 'error',

    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useSelector)',
      },
    ],
  },
};
