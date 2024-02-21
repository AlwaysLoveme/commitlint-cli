# commitlint-cli

<p align="left">
  <a href="https://img.shields.io/badge/support-IOS-516BEB?logo=ios&logoColor=white&style=plastic">
    <img src="https://img.shields.io/badge/support-Nodejs-516BEB?style=plastic">
  </a>
  <a href="https://www.npmjs.com/package/@zhuxian/commitlint-cli">
    <img src="https://img.shields.io/npm/v/@zhuxian/commitlint-cli/latest.svg">
  </a>
  <a href="https://www.npmjs.com/package/@zhuxian/commitlint-cli">
    <img src="https://img.shields.io/npm/dm/@zhuxian/commitlint-cli.svg"/>
  </a>
</p>

A node cli tool to generate git commitlint configuration rules for your project with @commitlint/cli and husky.

### Install

```bash
npm install -g @zhuxian/commitlint-cli
```

### Useage

after installed, run the following command in your project:

```bash
commitlint-cli init
```

after the command run successfully, When you commit with the git command, use `npm run commit` instead.
