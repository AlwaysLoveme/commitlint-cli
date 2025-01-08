import shell from "shelljs";
import Spinner from "@/shared/spinner";

function exec(commandStr: string, spinner?: Spinner, startMsg?: string, successMsg?: string) {
  return new Promise<void>(function (resolve, reject) {
    startMsg && spinner?.start(startMsg);
    shell.exec(commandStr, { silent: true }, function (code, stdout) {
      if (code !== 0) {
        spinner?.fail(stdout);
        reject();
      } else {
        successMsg && spinner?.succeed(successMsg);
        resolve();
      }
    });
  });
}

export default exec;
