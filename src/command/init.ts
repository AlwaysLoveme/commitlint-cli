import path from "path";
import chalk from "chalk";
import cFonts from "cfonts";
import fsExtra from "fs-extra";
import inquirer from "inquirer";
import parseYaml from "js-yaml";

import exec from "@/shared/shell";
import Spinner from "@/shared/spinner";
import { sleep } from "@/shared/utils";
import { eslintDependencies, commitLintDependencies } from "@/shared/constants";

const log = console.log;
const spinner = new Spinner({
  spinner: "dots",
  discardStdin: false,
});

const init = async () => {
  cFonts.say("HELLO", {
    tiny: true,
    font: "block", // define the font face
    align: "center", // define text alignment
    colors: ["greenBright", "yellow"], // define all colors
    background: "transparent", // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 1, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: "0", // define how many character can be on one line
    // gradient: ["#f80", "yellow"], // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false, // define if this is a transition between colors directly
    env: "node", // define the environment cfonts is being executed in
  });

  const currentProject = process.cwd();

  if (!fsExtra.existsSync(`${currentProject}/.git`)) {
    log("❎ " + chalk.red("当前项目未初始化 git，请使用 git init 初始化"));
    process.exit(0);
  }

  const currentPkg = path.resolve(__dirname, `${currentProject}/package.json`);
  if (!fsExtra.existsSync(currentPkg)) {
    log("❎ " + chalk.red("当前项目未使用包管理工具，请使用 npm init or pnpm init 初始化"));
    process.exit(0);
  }

  const packageJson = fsExtra.readJsonSync(currentPkg);
  const es6Module = packageJson.type === "module";
  const isReactProject = packageJson.dependencies?.react || packageJson.dependencies?.["react-dom"];

  const packageTool = {
    npm: "npm install",
    pnpm: "pnpm install",
    yarn: "yarn install",
  };
  const prompts: Parameters<typeof inquirer.prompt>[0][] = [
    {
      type: "list",
      name: "packageManager",
      message: "请选择你的包管理工具",
      choices: ["npm", "pnpm", "yarn"],
    },
    {
      type: "list",
      name: "enablePrettier",
      message: "是否启用 Prettier",
      choices: ["yes", "no"],
    },
  ];
  if (isReactProject) {
    prompts.push({
      type: "list",
      name: "enableEslint",
      message: "是否是启用 ESLint",
      choices: ["yes", "no"],
    });
  }

  const packagesDir: {
    dir: string;
    path: string;
    name: string;
  }[] = [];
  const workSpaceConfig = path.resolve(__dirname, `${currentProject}/pnpm-workspace.yaml`);
  const isWorkSpace = fsExtra.existsSync(workSpaceConfig);
  if (isWorkSpace) {
    const workSpaceYaml = fsExtra.readFileSync(workSpaceConfig, "utf-8");
    const data = parseYaml.load(workSpaceYaml) as Record<string, any>;
    const packages = (data["packages"] as string[]).map((item) => item.replace("/*", ""));
    for (const pkg of packages) {
      const stat = fsExtra.statSync(`${currentProject}/${pkg}`);
      if (stat.isDirectory()) {
        const pkgChildren = fsExtra
          .readdirSync(`${currentProject}/${pkg}`)
          .filter((item) => fsExtra.statSync(`${currentProject}/${pkg}/${item}`).isDirectory());
        for (const child of pkgChildren) {
          const parent = `${currentProject}/${pkg}`;
          const pkgObj = {
            dir: child,
            path: path.resolve(__dirname, `${parent}/${child}`),
            name: "",
          };
          const pkgFile = path.resolve(__dirname, `${parent}/${child}/package.json`);
          if (fsExtra.existsSync(pkgFile)) {
            const pkgJson = fsExtra.readJsonSync(pkgFile);
            if (pkgJson) {
              pkgObj.name = pkgJson.name;
            }
          }
          packagesDir.push({ ...pkgObj });
        }
      }
    }
    prompts.push({
      type: "list",
      name: "workspacePackage",
      message: "检测到多包项目, 请选择需要配置的包(默认是根目录)",
      choices: ["根目录", ...packagesDir.map((pkg) => pkg.dir)],
      default: "根目录",
    });
  }
  const answers = await inquirer.prompt(prompts);

  const npmPkgSet = [
    `scripts.prepare="husky"`,
    `scripts.commit="git add . && git cz"`,
    `scripts.changelog="conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"`,
    `config.commitizen.path="./node_modules/cz-conventional-changelog-zh"`,
  ];
  await exec(`npm pkg set ${npmPkgSet.join(" ")}`);
  const configFileExt = es6Module ? "mjs" : "js";
  const configFilePath =
    answers.workspacePackage === "根目录" || !answers.workspacePackage
      ? currentProject
      : packagesDir.find((pkg) => pkg.dir === answers.workspacePackage)?.path;
  fsExtra.writeFileSync(
    `${configFilePath}/lint-staged.config.${configFileExt}`,
    fsExtra.readFileSync(
      path.resolve(__dirname, `./configFiles/_lint-staged.config.${configFileExt}`),
      "utf-8",
    ),
    "utf-8",
  );
  fsExtra.writeFileSync(
    `${configFilePath}/commitlint.config.${configFileExt}`,
    fsExtra.readFileSync(
      path.resolve(__dirname, `./configFiles/_commitlint.config.${configFileExt}`),
      "utf-8",
    ),
    "utf-8",
  );

  if (answers.enablePrettier === "yes") {
    fsExtra.writeFileSync(
      `${configFilePath}/.prettierrc.${configFileExt}`,
      fsExtra.readFileSync(
        path.resolve(__dirname, `./configFiles/_prettierrc.${configFileExt}`),
        "utf-8",
      ),
      "utf-8",
    );
  }
  if (answers.enableEslint === "yes") {
    fsExtra.writeFileSync(
      `${configFilePath}/eslint.config.${configFileExt}`,
      fsExtra.readFileSync(
        path.resolve(__dirname, `./configFiles/_eslint.config.${configFileExt}`),
        "utf-8",
      ),
      "utf-8",
    );
  }

  let devDependencies = commitLintDependencies.join(" ");
  if (answers.enableEslint === "yes") {
    devDependencies += " " + eslintDependencies.join(" ");
  }
  const chosenPkgName = packagesDir.find((pkg) => pkg.dir === answers.workspacePackage)?.name;
  const installPath = chosenPkgName ? `--filter=${chosenPkgName}` : "";
  const workspaceDir = answers.workspacePackage !== "根目录" ? installPath : "-w";
  await exec(
    `${packageTool[answers.packageManager as keyof typeof packageTool]} ${devDependencies} -D ${isWorkSpace ? workspaceDir : ""}`,
    spinner,
    `正在安装依赖: ${devDependencies}`,
    "依赖安装成功",
  );
  await sleep();
  await exec(
    `${packageTool[answers.packageManager as keyof typeof packageTool]}`,
    spinner,
    `正在生成 Husky 配置`,
    "Husky 配置生成成功",
  );
  fsExtra.writeFileSync(
    `${configFilePath}/.husky/pre-commit`,
    fsExtra.readFileSync(path.resolve(__dirname, `./configFiles/pre-commit`), "utf-8"),
    "utf-8",
  );
  fsExtra.writeFileSync(
    `${configFilePath}/.husky/commit-msg`,
    fsExtra.readFileSync(path.resolve(__dirname, `./configFiles/commit-msg`), "utf-8"),
    "utf-8",
  );

  log(
    `🚀 Git 提交代码请使用一下命令: \n npm: ${chalk.greenBright(
      "npm run commit",
    )} \n pnpm: ${chalk.greenBright("pnpm commit")} \n yarn: ${chalk.greenBright("yarn commit")}`,
  );
  process.exit(0);
};

export default init;
