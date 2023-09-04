module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: "standard-with-typescript",
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
  },
};
