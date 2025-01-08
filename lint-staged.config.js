const formatStageFiles = (stageFiles) => {
  return stageFiles.join(" ");
};

module.exports = {
  "*.{js,jsx,tsx,ts,less,json}": (stageFiles) => [
    `eslint --fix ${formatStageFiles(stageFiles)}`,
    `prettier --write ${formatStageFiles(stageFiles)}`,
    "git add .",
  ],
};
