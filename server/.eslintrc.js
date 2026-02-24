const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['prettier-standard', 'eslint:recommended', 'plugin:node/recommended', 'plugin:sonarjs/recommended'],
  plugins: ['prettier', 'graphql', 'promise', 'node', 'sonarjs', 'security', 'immutable', 'import'],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'import/no-webpack-loader-syntax': 0,
    curly: ['error', 'all'],
    'key-spacing': [2, { beforeColon: false, afterColon: true }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'no-console': 2,
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'no-use-before-define': 0,
    'prefer-template': 2,
    'require-yield': 0,
    'prettier/prettier': ['error', prettierOptions],
    'node/handle-callback-err': ['off'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/no-absolute-path': 'error',
    'sonarjs/cognitive-complexity': ['error', 15],
    'security/detect-object-injection': 'off', // Turn off or adjust based on false positives
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'node/no-extraneous-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'max-lines-per-function': ['error', 250],
    'no-else-return': 'error',
    'max-params': ['error', 3],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        }
      }
    ],
    'no-shadow': 'error',
    complexity: ['error', 4],
    'no-empty': 'error',
    'import/order': ['error', { groups: [['builtin', 'external', 'internal', 'parent', 'sibling', 'index']] }],
    'immutable/no-let': 2,
    'immutable/no-this': 2,
    'immutable/no-mutation': 2,
    'max-lines': ['error', 350],
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error'
  },
  settings: {
    'import/resolver': {
      node: {
        app: './app',
        context: 'app',
        resolve: {
          app: './app',
          paths: ['app'],
          modules: ['app', 'node_modules'],
          extensions: ['.js', '.json', '.coffee']
        }
      }
    }
  }
};
