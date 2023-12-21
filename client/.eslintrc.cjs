module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    'plugin:tailwindcss/recommended',
    "plugin:@typescript-eslint/recommended-type-checked"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.node.json"],
  },
  plugins: ["prettier", "simple-import-sort"],
  rules: {
    "@typescript-eslint/no-unsafe-member-access": "off", // too verbose
    "@typescript-eslint/no-unsafe-assignment": "off", // too verbose
    "@typescript-eslint/no-unsafe-argument": "off", // too verbose
    "@typescript-eslint/consistent-type-imports": ["error", {fixStyle: 'inline-type-imports'}],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { destructuredArrayIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
  },
};
