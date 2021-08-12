const path = require('path');
const { packages, toPackagePath } = require('./scripts/utils');

const tsExtends = [
  'airbnb-typescript',
  'plugin:react-hooks/recommended',
  'plugin:import/recommended',
  'plugin:import/typescript',
  'plugin:@typescript-eslint/recommended',
  'plugin:prettier/recommended',
];

const tsRules = {
  'no-void': 'off',
  'no-param-reassign': 'off',
  'no-underscore-dangle': 'off',
  'no-nested-ternary': 'off',

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

  'react/require-default-props': 'off',
  'react/prop-types': 'off',

  'react-hooks/exhaustive-deps': 'warn',
};

const nextjsProjects = ['caroline'];

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    quotes: ['error', 'single'],
  },
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: tsExtends,
      settings: {
        // https://github.com/benmosher/eslint-plugin-import/issues/1485#issuecomment-535351922
        'import/resolver': {
          typescript: {
            project: 'tsconfig.eslint.json',
          },
        },
      },
      parserOptions: {
        project: 'tsconfig.eslint.json',
      },
      rules: tsRules,
    },
    ...packages.map((pkg) => ({
      files: [`packages/${pkg}/**/*.ts`, `packages/${pkg}/**/*.tsx`],
      settings: {
        'import/resolver': {
          typescript: {
            project: path.join(toPackagePath(pkg), 'tsconfig.eslint.json'),
          },
        },
      },
      parserOptions: {
        project: path.join(toPackagePath(pkg), 'tsconfig.eslint.json'),
      },
    })),
    ...nextjsProjects.map((project) => ({
      files: [`packages/${project}/**/*.ts`, `packages/${project}/**/*.tsx`],
      extends: ['next', 'next/core-web-vitals', ...tsExtends],
      rules: {
        ...tsRules,
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
        '@next/next/no-html-link-for-pages': [
          'error',
          path.join(toPackagePath(project), 'src', 'pages'),
        ],
      },
    })),
    {
      files: nextjsProjects.map(
        (project) => `packages/${project}/src/pages/_app.tsx`
      ),
      rules: {
        'react/jsx-props-no-spreading': 'off',
      },
    },
    {
      files: nextjsProjects.flatMap((project) => [
        `packages/${project}/src/pages/**/*.ts`,
        `packages/${project}/src/pages/**/*.tsx`,
      ]),
      rules: {
        'import/prefer-default-export': 'error',
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['**/src/resolvers/**/*.ts'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ],
};
