import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { Command } from "commander";
import pkg from "../package.json";
import Spinner from "@/shared/spinner";

const log = console.log;
const spinner = new Spinner({
  spinner: "timeTravel",
  discardStdin: false,
});
const command = new Command();

command.version(pkg.version);
command
  .command("init")
  .description("init commitlint configuration file in your project")
  .action(async () => {
    const currentProject = process.cwd();
    const currentPkg = path.resolve(
      __dirname,
      `${currentProject}/package.json`,
    );
    const yarnLock = path.resolve(__dirname, `${currentProject}/yarn.lock`);
    const pnpmLock = path.resolve(
      __dirname,
      `${currentProject}/pnpm-lock.yaml`,
    );
    if (!fs.existsSync(currentPkg)) {
      log("❎ " + chalk.red("不是 npm 模块项目, 请执行 npm init 或 pnpm init"));
      process.exit(0);
    }

    let packageTool: "yarn add" | "npm install" | "pnpm add" = "npm install";
    if (fs.existsSync(yarnLock)) {
      packageTool = "yarn add";
    } else if (fs.existsSync(pnpmLock)) {
      packageTool = "pnpm add";
    }

    const dependText =
      "husky@latest @commitlint/cli@latest @commitlint/config-conventional@latest conventional-changelog-cli@latest cz-conventional-changelog-zh@latest";
    const depend = chalk.greenBright(dependText);
    spinner.clear();
    spinner.start(`正在安装依赖: ${depend}`);

    const { execa: execSh } = await import("execa");
    const { stderr } = await execSh(packageTool.split(" ")[0], [packageTool.split(" ")[1], ...dependText.split(" "), "-D"]);
    if (stderr) {
      spinner.fail(stderr);
      process.exit(0);
    } else {
      spinner.succeed("依赖已成功添加");
    }

    spinner.start(
      "正在配置 package.json, 此操作需要你先配置好 prettier 格式化插件",
    );
    const pkgContent = await fs.readFile(currentPkg);
    const pkgJson = JSON.parse(pkgContent.toString());

    pkgJson.scripts.prepare = "husky install";
    pkgJson.scripts.commit = "git add . && git cz";
    pkgJson.scripts.changelog =
      "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md";
    pkgJson.husky = {
      hooks: {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      },
    };
    pkgJson["lint-staged"] = {
      "*.{js,jsx,tsx,ts,less,md,json}": [
        "prettier --write ./src/**/*",
        "git add .",
      ],
    };
    pkgJson.config = {
      commitizen: {
        path: "./node_modules/cz-conventional-changelog-zh",
      },
    };
    try {
      await fs.writeFile(currentPkg, JSON.stringify(pkgJson, null, 2));
      spinner.succeed("package.json 已配置完成");
    } catch (error: any) {
      spinner.fail(error.toString());
    }

    spinner.start("正在生成 commitlint.config.js 文件");
    try {
      await fs.writeFile(
        `${currentProject}/commitlint.config.js`,
        `module.exports = { extends: ["@commitlint/config-conventional"] };`,
      );
      spinner.succeed("commitlint.config.js 已配置完成");
    } catch (error: any) {
      spinner.fail(error.toString());
    }
  });

command.parse(process.argv);
