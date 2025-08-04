const formatStageFiles = stageFiles => {
  return stageFiles.join(" ");
};

export default {
  "*.{js,jsx,tsx,ts,less,scss}": stageFiles => [
    `eslint --fix ${formatStageFiles(stageFiles)}`,
    `prettier --write ${formatStageFiles(stageFiles)}`,
    "git add .",
  ],
};
