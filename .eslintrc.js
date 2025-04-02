module.exports = {
  extends: 'erb',
  plugins: ['@typescript-eslint'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useEventIpc|useEventWindow|useEventElement|useEventFabricMouse|useEventFabricWheel)',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'no-undef': 'off',
    'no-nested-ternary': 'off',
    'no-dupe-class-members': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': 'off',
    'class-methods-use-this': 'off',
    camelcase: 'off',

    /**
     * erb의 깊은 eslint 설정을 건드리기 귀찮아서 수동으로 off
     */
    'jsx-a11y/heading-has-content': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
