import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
    js.configs.recommended,

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
    settings: {
            "import/resolver": {
        typescript: { project: "./tsconfig.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
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

            "import/order": "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

    "no-unused-vars": "off",
  // Rely on TypeScript for undefined variables in TS/TSX; allows using browser globals without file-level env comments
  "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],

      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
                            group: ["../**/*"],
              message:
                "Importa otras carpetas únicamente a través de su índice. Usa `../carpeta` (que resuelve a su index) en lugar de `../carpeta/sub`.",
            },
            {
                                          group: ["@/*/*"],
              message:
                "No se permiten deep imports por alias. Importa solo desde la raíz del feature (su index), p. ej. `@/feature`.",
            },
          ],
        },
      ],

      "import/no-internal-modules": [
        "error",
        {
                              allow: [
            "**/index",
            "**/index.{ts,tsx,js,jsx}",
            "./*",
            "@/*",
          ],
        },
      ],
    },
  },
];
