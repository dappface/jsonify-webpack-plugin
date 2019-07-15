module.exports =  {
  parser:  '@typescript-eslint/parser', 
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'json'
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module'
  },
  rules: {
    // details: https://github.com/typescript-eslint/typescript-eslint/issues/201
    '@typescript-eslint/explicit-member-accessibility': 'off',
  }
}
