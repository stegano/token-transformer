#!/usr/bin/env node
import path from "node:path";
import { Command } from "commander";
import { Config, Init, Run } from "./actions";
import { CONFIG_JS_FILE_NAME } from "./utils";

export const program = new Command("tt");

const { env } = process;

program
  .command("init")
  .option("-d, --fileDir <directory>", "Directory to generate config file.", ".")
  .option("-c, --cli", "Create a dedicated configuration file for the CLI.", false)
  .option("-f, --force", "Force creation if file exists", false)
  .action(Init.action);

program
  .command("run")
  .argument("[token]")
  .option(
    "-c, --config-file <filepath>",
    "Config file path.",
    env.TT_JS_CONFIG || env.TT_JSON_CONFIG,
  )
  .option("-o, --output-file <filepath>", "Output file path.", env.TT_OUTPUT_FILE)
  .option("-t, --token <string>", "Input token.(ignores file at token path)", env.TT_TOKEN)
  .option("-f, --token-file <filepath>", "Token file path.", env.TT_TOKEN_FILE)
  .option(
    "-pr, --pre-processors <module...>",
    "Pre-processor names.",
    env.TT_PRE_PROCESSORS ? env.TT_PRE_PROCESSORS.split(",") : [],
  )
  .option(
    "-po, --post-processors <module...>",
    "Post-processor names.",
    env.TT_POST_PROCESSORS ? env.TT_POST_PROCESSORS.split(",") : [],
  )
  .option(
    "-p, --presets <module...>",
    "Preset names.",
    env.TT_PRESETS ? env.TT_PRESETS.split(",") : [],
  )
  .option(
    "-v, --verbose",
    "Print to stdout if output file doesn't exist.",
    env.TT_VERBOSE === "true",
  )
  .option("--debug", "Print debug information.", env.TT_DEBUG === "true")
  .action(Run.action);

const configProgram = new Command("config");

configProgram
  .command("show")
  .option("-n, --name <name...>", "Display the values for the input option names.", [])
  .option("-l, --line-numbers", "Display with line numbers.", false)
  .option(
    "-c, --config-file <filepath>",
    "Config file path.",
    env.TT_JS_CONFIG || env.TT_JSON_CONFIG || path.resolve(process.cwd(), CONFIG_JS_FILE_NAME),
  )
  .action(Config.Show.action);

configProgram
  .command("set")
  .option("-n, --name <name>", "Option name to be set.")
  .option("-v, --value <value...>", "Option value to be set.")
  .option(
    "-c, --config-file <filepath>",
    "Config file path.",
    env.TT_JS_CONFIG || env.TT_JSON_CONFIG || path.resolve(process.cwd(), CONFIG_JS_FILE_NAME),
  )
  .action(Config.Set.action);

configProgram
  .command("unset")
  .option("-n, --name <name>", "Option name to be unset.")
  .option(
    "-c, --config-file <filepath>",
    "Config file path.",
    env.TT_JS_CONFIG || env.TT_JSON_CONFIG || path.resolve(process.cwd(), CONFIG_JS_FILE_NAME),
  )
  .action(Config.Unset.action);

program.addCommand(configProgram);
program.version("<version>");
program.parse(process.argv);

export default program;
