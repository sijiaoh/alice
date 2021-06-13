module.exports = {
  root: true,
  extends: ["airbnb-typescript/base", "plugin:prettier/recommended"],
  parserOptions: {
    project: `tsconfig.eslint.json`,
  },
  rules: {
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/promise-function-async": "error",
  },
};
