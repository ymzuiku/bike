const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

function loadArgs(argv) {
  const conf = yargs(hideBin(argv))
    .option("src", {
      alias: "s",
      type: "string",
      default: "src",
      description: "Source dir",
    })
    .option("out", {
      alias: "o",
      type: "string",
      default: "dist",
      description: "Build out dir",
    })
    .option("public", {
      alias: "p",
      type: "string",
      default: "public",
      description: "Auto copy public's files to out",
    })
    .option("entry", {
      alias: "e",
      type: "string",
      default: "src/index.ts",
      description: "Main typescript file",
    })
    .option("sourcemap", {
      alias: "m",
      type: "boolean",
      default: true,
      description: "Esbuild use sourcemap",
    })
    .option("test", {
      alias: "t",
      type: "boolean",
      default: false,
      description: "Is use test",
    })
    .option("start", {
      type: "boolean",
      default: false,
      description: "Start server after on build",
    })
    .option("platform", {
      type: "string",
      default: "node",
      description: "Esbuild platform",
    })
    .option("watch", {
      alias: "w",
      type: "boolean",
      default: false,
      description: "Watch dir on change reload",
    })
    .option("clear", {
      type: "boolean",
      default: true,
      description: "On reload auto clear",
    })
    .option("reporter", {
      alias: "r",
      type: "string",
      description: "(bike-tdd) c8 reporter, pick in :[text, html]",
    })
    .option("match", {
      type: "string",
      default: "(.test|.spec|_test|_spec)",
      description: "(bike-tdd) test files RegExp string",
    })
    .option("rematch", {
      type: "boolean",
      default: false,
      description: "(bike-tdd) auto rematch all test files on watch",
    })
    .option("c8-include", {
      alias: "c8-i",
      type: "boolean",
      default: false,
      description: "(bike-tdd) c8 include all files",
    })
    .option("c8-config", {
      type: "string",
      default: "",
      description: "(bike-tdd) c8 path to JSON configuration file",
    })
    .option("c8-exclude", {
      type: "boolean",
      default: false,
      description: "(bike-tdd) c8 exclude all files",
    })
    .option("skip-full", {
      type: "boolean",
      description: "(bike-tdd) c8 skip full in text that ignore in html",
    }).argv;

  if (conf.reporter === "text" && conf["skip-full"] == undefined) {
    conf["skip-full"] = true;
  }

  return conf;
}

module.exports = loadArgs;
