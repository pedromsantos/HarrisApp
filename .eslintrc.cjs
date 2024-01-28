module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', "@typescript-eslint/eslint-plugin",
  "simple-import-sort",
  "import"],
  rules: {
    "no-console": 1,
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
