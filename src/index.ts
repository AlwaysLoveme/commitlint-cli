import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { Command } from "commander";
import pkg from "../package.json";
import Spinner from "@/shared/spinner";
import cFonts from "cfonts";
import { centerText } from "@/shared/utils";

const log = console.log;
const spinner = new Spinner({
  spinner: "bounce",
  discardStdin: false,
});
const command = new Command();

command.version(pkg.version);
command
  .command("init")
  .description("init commitlint configuration file in your project")
  .action(async () => {
    cFonts.say("commitlint", {
      tiny: true,
      font: "block", // define the font face
      align: "center", // define text alignment
      //colors: ["greenBright", "yellow"], // define all colors
      background: "transparent", // define the background color, you can also use `backgroundColor` here as key
      letterSpacing: 1, // define letter spacing
      lineHeight: 1, // define the line height
      space: true, // define if the output text should have empty lines on top and on the bottom
      maxLength: "0", // define how many character can be on one line
      gradient: ["#f80", "yellow"], // define your two gradient colors
      independentGradient: false, // define if you want to recalculate the gradient for each new line
      transitionGradient: false, // define if this is a transition between colors directly
      env: "node", // define the environment cfonts is being executed in
    });
    log(
      centerText(
        "---- author: zhuxian email：z18270244870@gmail.com ---- \n\n",
      ),
    );
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
      log(
        "❎ " +
          chalk.red(
            "Not an npm module project, please execute npm init or pnpm init",
          ),
      );
      process.exit(0);
    }

    const { execa } = await import("execa");

    spinner.start("configuring package.json");
    try {
      const lintStagedValue = {
        "*.{js,jsx,tsx,ts,less,md,json}": [
          "prettier --write ./src",
          "git add .",
        ],
      };
      const huskyValue = {
        hooks: {
          "pre-commit": "lint-staged",
          "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
        },
      };
      const npmPkgSet = [
        `scripts.prepare="husky install"`,
        `scripts.commit="git add . && git cz"`,
        `scripts.changelog="conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"`,
        `husky=${JSON.stringify(huskyValue)}`,
        `lint-staged=${JSON.stringify(lintStagedValue)}`,
        `config.commitizen.path="./node_modules/cz-conventional-changelog-zh"`,
      ];
      await execa("npm", ["pkg", "set", ...npmPkgSet, "--json"]);
      spinner.succeed(
        "package.json configured successfully, Please make sure you have configured eslint and prettier plugins before",
      );
    } catch (error: any) {
      spinner.fail(error.toString());
      process.exit(0);
    }

    spinner.start("Generating commitlint.config.js file");
    try {
      await fs.writeFile(
        `${currentProject}/commitlint.config.js`,
        `module.exports = { extends: ["@commitlint/config-conventional"] };`,
      );
      spinner.succeed("commitlint.config.js configured successfully");
    } catch (error: any) {
      spinner.fail(error.toString());
    }

    let packageTool: "yarn add" | "npm install" | "pnpm add" = "npm install";
    if (fs.existsSync(yarnLock)) {
      packageTool = "yarn add";
    } else if (fs.existsSync(pnpmLock)) {
      packageTool = "pnpm add";
    }

    const dependText =
      "husky@latest @commitlint/cli@latest @commitlint/config-conventional@latest conventional-changelog-cli@latest cz-conventional-changelog-zh@latest commitizen@latest lint-staged";
    const depend = chalk.greenBright(dependText);
    spinner.clear();

    spinner.start(`installing dependencies: ${depend}`);
    const { stderr } = await execa(packageTool.split(" ")[0], [
      packageTool.split(" ")[1],
      ...dependText.split(" "),
      "-D",
    ]);
    if (stderr) {
      spinner.fail(stderr);
      process.exit(0);
    } else {
      spinner.succeed("Dependency has been successfully installed");
    }

    spinner.start("configuring husky");
    try {
      await execa("npx", ["husky", "install"]);
      const huskyInit: [string, string[]][] = [
        [
          "npx",
          [
            "husky",
            "add",
            ".husky/commit-msg",
            `npx --no -- commitlint --edit "$1"`,
          ],
        ],
        ["npx", ["husky", "add", `.husky/pre-commit`, "npm lint-staged"]],
      ];
      const commands = huskyInit.map(([command, args]) => execa(command, args));
      await Promise.all(commands);
      spinner.succeed("husky has been configured");
      log(
        `🚀 Git commits please use the following command: \n npm: ${chalk.greenBright(
          "npm run commit",
        )} \n pnpm: ${chalk.greenBright(
          "pnpm commit",
        )} \n yarn: ${chalk.greenBright("yarn commit")}`,
      );
    } catch (error: any) {
      spinner.fail(chalk.red(`husky configured failed：${error.toString()}`));
      process.exit(0);
    }
  });

command.parse(process.argv);
