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

  'react-hooks/exhaustive-deps': [
    'warn',
    {
      // reactive-class's hook.'
      additionalHooks: '(useSelector)',
    },
  ],
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
            project: 'packages/*/tsconfig.eslint.json',
          },
        },
      },
      parserOptions: {
        project: 'tsconfig.eslint.json',
      },
      rules: tsRules,
    },
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
          `packages/${project}/pages`,
        ],
      },
    })),
    {
      files: nextjsProjects.map(
        (project) => `packages/${project}/pages/_app.tsx`
      ),
      rules: {
        'react/jsx-props-no-spreading': 'off',
      },
    },
    {
      files: nextjsProjects.flatMap((project) => [
        `packages/${project}/pages/**/*.ts`,
        `packages/${project}/pages/**/*.tsx`,
      ]),
      rules: {
        'import/prefer-default-export': 'error',
        'import/no-default-export': 'off',
      },
    },
    {
      files: nextjsProjects.flatMap((project) => [
        `packages/${project}/src/entities/**/*.ts`,
        `packages/${project}/src/entities/**/*.tsx`,
      ]),
      rules: {
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['**/graphql/resolvers/**/*.ts'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ],
};
