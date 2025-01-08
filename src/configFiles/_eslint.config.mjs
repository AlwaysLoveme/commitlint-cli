// @ts-check

import eslint from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import typescriptParser from "@typescript-eslint/parser";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  tsEslint.configs.strictTypeChecked,
  tsEslint.configs.stylisticTypeChecked,
  pluginReact.configs.flat.recommended,
  pluginReactRefresh.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        sensors: "readonly",
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "no-debugger": 0,
      "array-callback-return": [2],
      "react-refresh/only-export-components": ["off", { allowConstantExport: true }],
      quotes: [2, "double", { allowTemplateLiterals: true }],
      eqeqeq: 2, // 要求使用 === 和 !==
      "no-empty": 2, // 块语句中的内容不能为空
      "no-empty-character-class": 2, // 正则表达式中的[]内容不能为空
      "no-extra-boolean-cast": 2, // 禁止不必要的bool转换
      "no-extra-parens": 0, // 禁止非必要的括号
      "no-invalid-this": 2, // 禁止无效的this，只能用在构造器，类，对象字面量
      "no-irregular-whitespace": 2, // 不能有不规则的空格
      "no-self-assign": 2, // 禁止自我赋值
      "no-self-compare": 2, // 禁止自身比较
      "no-sequences": 2, // 禁用逗号操作符
      "no-unmodified-loop-condition": 2, // 禁用一成不变的循环条件
      "no-unused-expressions": 0, // 禁止出现未使用过的表达式
      "object-curly-spacing": [2, "always"], // 对象前后需要空格
      "callback-return": 0, // 避免多次调用回调
      "react/self-closing-comp": [
        2,
        {
          component: true,
          html: true,
        },
      ],
      "react/react-in-jsx-scope": 0,
      "react/jsx-no-undef": [2, { allowGlobals: true }],
      "react-hooks/exhaustive-deps": [0],
      "react/no-array-index-key": [0],
      //推荐使用isNaN方法，而不要直接和NaN作比较
      "use-isnan": 2,
      "object-curly-newline": [
        0,
        {
          minProperties: 3,
        },
      ],
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-var-requires": 2,
      "@typescript-eslint/no-unused-vars": [2, { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-expressions": 0,
      "@typescript-eslint/require-await": 0,
      "@typescript-eslint/no-unsafe-member-access": 0,
      "@typescript-eslint/no-unsafe-argument": 0,
      "@typescript-eslint/no-unsafe-assignment": 0,
      "@typescript-eslint/no-unsafe-call": 0,
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
);
