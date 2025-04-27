import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // eslint-disable-next-line curly
      curly: 'off',
    },
  },
  {
    files: ['**/*.story.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['app/api/**/route.{ts,tsx}'],
    rules: {
      // allow console.* in those files
      'no-console': 'off',

      // ignore an unused parameter named `error` or starting with _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  }
);
