import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // 🚀 TypeScript strict rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // 🚀 React best practices
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'warn',

      // 🚀 General code quality
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',

      // 🚀 Next.js specific
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
  {
    // Special rules for test files
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    // Special rules for config files
    files: ['*.config.{js,ts,mjs}', '*.setup.{js,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
