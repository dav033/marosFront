import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  // ...eslintPluginAstro.configs['flat/recommended'], // Desactivado temporalmente para evitar errores de parsing
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: { parser: tsparser },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": hooks,
      "jsx-a11y": a11y,
    },
    rules: {
      // TS
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      // React/Hooks
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // A11y
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
    },
  },
  {
    files: ["**/*.astro"],
    ignores: ["**/*.astro"],
  },
];
