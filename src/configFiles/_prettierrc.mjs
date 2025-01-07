/** @type {import("prettier").Config} */

export default {
    printWidth: 100,
    semi: true,
    useTabs: false,
    tabWidth: 2,
    singleQuote: false,
    quoteProps: "as-needed",
    // 在唯一的箭头函数参数周围包含括号
    arrowParens: "always",
    // 设置对象两边元素留有空格
    bracketSpacing: true,
    bracketSameLine: false,
    jsxBracketSameLine: false,
    // 属性一行一个
    singleAttributePerLine: true,
    proseWrap: "never",
    overrides: [
        {
            files: "*.wxml",
            options: {
                parser: "html",
            },
        },
        {
            files: "*.wxss",
            options: {
                parser: "css",
            },
        },
        {
            files: "*.wxs",
            options: {
                parser: "babel",
            },
        },
    ],
};