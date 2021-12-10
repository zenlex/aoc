/* eslint-disable quote-props */
/* eslint-disable quotes */
module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "standard"
  ],
  "parserOptions": {
    "ecmaVersion": 'latest'
  },
  "rules": {
    "semi": [1, "always"],
    "no-trailing-spaces": [1,
      {
        "skipBlankLines": true,
        "ignoreComments": true
      }
    ],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }]
  }
};
