module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  plugins: ["prettier", "simple-import-sort"],
  ignorePatterns: ["dist", ".eslintrc.cjs", "declarations"],
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
    "@typescript-eslint/no-explicit-any": "off", // Don't do this, unless you're certain!
    "@typescript-eslint/no-unsafe-member-access": "off", // too verbose
    "@typescript-eslint/no-unsafe-assignment": "off", // too verbose
    "@typescript-eslint/no-unsafe-argument": "off", // too verbose
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "inline-type-imports" },
    ],
    "simple-import-sort/imports": "error",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        destructuredArrayIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
};
