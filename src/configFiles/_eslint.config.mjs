import eslint from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import typescriptParser from "@typescript-eslint/parser";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReactRefresh.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist", "node_modules", ".idea", ".cursor"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        ...globals.jest,
        sensors: "readonly",
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser, 
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true, 
        tsconfigRootDir: import.meta.dirname 
      } 
    },
    extends: [tsEslint.configs.strictTypeChecked, tsEslint.configs.stylisticTypeChecked],
    rules: {
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    settings: { react: { version: "detect" } },
    rules: {
      "no-debugger": "off",
      "array-callback-return": ["error"],
      "react-refresh/only-export-components": ["off", { allowConstantExport: true }],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      eqeqeq: "error", // 要求使用 === 和 !==
      "no-empty": "error", // 块语句中的内容不能为空
      "no-empty-character-class": "error", // 正则表达式中的[]内容不能为空
      "no-extra-boolean-cast": "error", // 禁止不必要的bool转换
      "no-extra-parens": "off", // 禁止非必要的括号
      "no-invalid-this": "error", // 禁止无效的this，只能用在构造器，类，对象字面量
      "no-irregular-whitespace": "error", // 不能有不规则的空格
      "no-self-assign": "error", // 禁止自我赋值
      "no-self-compare": "error", // 禁止自身比较
      "no-sequences": "error", // 禁用逗号操作符
      "no-unmodified-loop-condition": "error", // 禁用一成不变的循环条件
      "no-unused-expressions": "off", // 禁止出现未使用过的表达式
      "object-curly-spacing": ["error", "always"], // 对象前后需要空格
      "callback-return": "off", // 避免多次调用回调
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-undef": ["error", { allowGlobals: true }],
      "react-hooks/exhaustive-deps": ["off"],
      "react/no-array-index-key": ["off"],
      // 推荐使用isNaN方法，而不要直接和NaN作比较
      "use-isnan": ["error"],
    },
  },
);
