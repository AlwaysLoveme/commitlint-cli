const formatStageFiles = stageFiles => {
  return stageFiles.join(" ");
};

module.exports = {
  "*.{js,jsx,tsx,ts,less}": stageFiles => [
    `eslint --fix ${formatStageFiles(stageFiles)}`,
    `prettier --write ${formatStageFiles(stageFiles)}`,
    "git add .",
  ],
};
