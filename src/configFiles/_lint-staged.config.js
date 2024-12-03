const path = require("node:path");

const formatStageFiles = stageFiles => {
  return stageFiles.map(file => path.relative(process.cwd(), file)).join(" ");
};

module.exports = {
  "*.{js,jsx,tsx,ts,less,json}": stageFiles => [
    `eslint --fix ${formatStageFiles(stageFiles)}`,
    `prettier --write ${formatStageFiles(stageFiles)}`,
    "git add .",
  ],
};
