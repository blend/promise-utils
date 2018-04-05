const _ = require('lodash');

module.exports = {
  rules: _.omit(require('./tslint.js').rules, [
    'no-invalid-this',
    'max-classes-per-file',
    'no-magic-numbers',
    'no-unused-new',
    'max-file-line-count',
    'object-literal-sort-keys',
    'no-any',
    'no-var-requires',
    'no-require-imports',
    'no-empty',
    'typedef',
    'completed-docs'
  ])
};
