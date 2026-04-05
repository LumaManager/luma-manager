import js from "@eslint/js";
import tseslint from "typescript-eslint";

export const baseConfig = tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: process.cwd()
    }
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  }
}, {
  ignores: ["dist/**", ".next/**", "node_modules/**", "coverage/**"]
});
