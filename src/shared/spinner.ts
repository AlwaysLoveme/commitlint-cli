import ora, { Options, Ora } from "ora";

export default class Spinner {
  spinnerInstance!: Ora;

  constructor(options: Options) {
    this.spinnerInstance = ora(options);
  }

  start(text?: string) {
    if (!this.spinnerInstance.isSpinning) {
      this.spinnerInstance.start(`${text} \n`);
    }
  }
  fail(text?: string) {
    this.spinnerInstance.fail(`${text} \n`);
  }
  succeed(text?: string) {
    this.spinnerInstance.succeed(`${text}`);
  }
  clear() {
    this.spinnerInstance.clear();
  }
}
