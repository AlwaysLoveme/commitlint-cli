import { Command } from "commander";
import pkg from "../package.json";
import init from "@/command/init";

const command = new Command();
command.version(pkg.version);
command
  .command("init")
  .description("init commitlint configuration file in your project")
  .action(init);

command.parse(process.argv);
