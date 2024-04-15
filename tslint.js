module.exports = {
  rules: {
    'adjacent-overload-signatures': true,
    'member-access': true,
    'member-ordering': [true, { order: 'fields-first' }],
    'no-any': true,
    'no-empty-interface': true,
    'no-internal-module': true,
    'no-magic-numbers': [true, 0, 1, 200, 204, 404, 500, 503, 504],
    'prefer-for-of': true,
    'no-for-in-array': true,
    'promise-function-async': true,
    'restrict-plus-operands': true,
    typedef: [
      true,
      'call-signature',
      'parameter',
      'property-declaration',
      'member-variable-declaration'
    ],
    'typedef-whitespace': [
      true,
      {
        'call-signature': 'nospace',
        'index-signature': 'nospace',
        parameter: 'nospace',
        'property-declaration': 'nospace',
        'variable-declaration': 'nospace'
      },
      {
        'call-signature': 'onespace',
        'index-signature': 'onespace',
        parameter: 'onespace',
        'property-declaration': 'onespace',
        'variable-declaration': 'onespace'
      }
    ],
    curly: true,
    'label-position': true,
    'no-arg': true,
    'no-bitwise': true,
    'no-conditional-assignment': true,
    'no-console': [true, 'log', 'error'],
    'no-construct': true,
    'no-default-export': true,
    'no-debugger': true,
    'no-duplicate-variable': true,
    'no-empty': true,
    'no-eval': true,
    'no-invalid-this': true,
    'no-shadowed-variable': true,
    'no-string-throw': true,
    'no-switch-case-fall-through': true,
    'no-unsafe-finally': true,
    'no-unused-expression': true,
    'no-use-before-declare': true,
    'no-var-keyword': true,
    'no-var-requires': true,
    'no-require-imports': true,
    'no-reference': true,
    radix: true,
    'switch-default': true,
    'triple-equals': true,
    'use-isnan': true,
    'cyclomatic-complexity': true,
    'eofline': true,
    indent: [true, 'spaces'],
    'linebreak-style': [true, 'LF'],
    'max-classes-per-file': [true, 1],
    'max-file-line-count': [true, 300],
    'max-line-length': [true, 100],
    'no-mergeable-namespace': true,
    'no-namespace': true,
    'no-trailing-whitespace': true,
    'object-literal-sort-keys': true,
    'prefer-const': true,
    'array-type': [true, 'array'],
    'callable-types': true,
    'class-name': true,
    'comment-format': [true, 'check-space'],
    'interface-over-type-literal': true,
    'jsdoc-format': true,
    'completed-docs': [true, 'classes', 'functions', 'methods'],
    'new-parens': true,
    'no-angle-bracket-type-assertion': true,
    'no-consecutive-blank-lines': true,
    'no-parameter-properties': true,
    'object-literal-key-quotes': [true, 'as-needed'],
    'one-line': [
      true,
      'check-catch',
      'check-finally',
      'check-else',
      'check-whitespace',
      'check-open-brace'
    ],
    'one-variable-per-declaration': true,
    'ordered-imports': [
      true,
      {
        'import-sources-order': 'lowercase-last',
        'named-imports-order': 'lowercase-last'
      }
    ],
    quotemark: [true, 'single'],
    'trailing-comma': [true, {
      "multiline": {
        "objects": "always",
        "arrays": "always",
        "functions": "never",
        "typeLiterals": "ignore"
      }, singleline: 'never'
    }],
    semicolon: [true, 'always'],
    'variable-name': true,
    whitespace: [
      true,
      'check-branch',
      'check-decl',
      'check-operator',
      'check-module',
      'check-separator',
      'check-type',
      'check-typecast'
    ]
  }
};
