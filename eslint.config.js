// ESLint config for Astro + TS + React (TSX in islands)
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

// Minimal flat config compatible with ESLint's flat config system
export default [
  {
    ignores: ["dist/**", ".astro/**"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import hygiene
      "import/order": "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // No unused
      "no-unused-vars": "off",
    },
  },
];
