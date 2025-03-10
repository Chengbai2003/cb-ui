module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",  // vue parse https://eslint.vuejs.org/
    "plugin:@typescript-eslint/recommended",
    "@vue/typescript/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser":"@typescript-eslint/parser",
    "sourceType":"module",
  },
  "rules": {
    "vue/html-self-closing": "off",
    // "vue/singleline-html-element-content-newline":"off",
    "vue/multi-word-component-names": "off",
    "vue/prefer-import-from-vue":"off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
  },
  global: {
    defineProps: "readonly",
    defineOptions: "readonly"
  }
}