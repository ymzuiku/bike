/* c8 ignore start */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export function getConfig(argv: string[]) {
  const confObj = yargs(hideBin(argv))
    .option("argv", {
      type: "array",
      description: "Backup all argv",
    })
    .option("log-config", {
      type: "boolean",
      default: false,
      description: "Log cli config at run",
    })
    .option("browser", {
      type: "boolean",
      description: "Use build browser types",
    })
    .option("html", {
      alias: "h",
      type: "string",
      description: "Use base html When type is browser",
    })
    .option("html-out", {
      type: "string",
      description: "Build client out dir, server default dist/client",
    })
    .option("out", {
      type: "string",
      description:
        "Build out dir, server default dist/server, test default dist/test",
    })
    .option("outfile", {
      type: "string",
      default: "index.js",
      description: "Build out dir index name",
    })
    .option("static", {
      type: "string",
      default: "static",
      description: "Auto copy static's files to out",
    })
    .option("public", {
      type: "string",
      default: "public",
      description: "Auto copy public's files to html-out",
    })
    .option("entry", {
      type: "string",
      description: "Main typescript file, default: ${source}/index.ts",
    })
    .option("spawn", {
      type: "boolean",
      default: false,
      description: "Use child_process.spawn replace cluster.fork",
    })
    .option("copy", {
      type: "array",
      description: "Copy other file to dist",
    })
    .option("minify", {
      alias: "m",
      type: "boolean",
      description: "Esbuild minify",
    })
    .option("bundle", {
      type: "boolean",
      default: true,
      description: "Esbuild bundle",
    })
    .option("depend", {
      type: "boolean",
      description: "Esbuild bundle dependencies",
    })
    .option("external", {
      alias: "e",
      type: "array",
      description: "Esbuild external",
    })
    .option("define", {
      type: "string",
      description: "Esbuild define",
    })
    .option("target", {
      type: "string",
      default: "es2018",
      description:
        "Esbuild target, browser default: es6, nodejs default: es2018",
    })
    .option("splitting", {
      type: "boolean",
      description: "Esbuild splitting",
    })
    .option("format", {
      type: "string",
      description: "Esbuild format",
    })
    .option("sourcemap", {
      type: "boolean",
      description: "Esbuild use sourcemap",
    })
    .option("test", {
      alias: "t",
      type: "boolean",
      default: false,
      description: "Is use test",
    })
    .option("all", {
      type: "boolean",
      default: false,
      description: "Always test all case, ignore .bike.test.yaml",
    })
    .option("focus", {
      alias: "f",
      type: "string",
      description: "Use RegExp focus some test",
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
      type: "array",
      default: false,
      description:
        "Watch source dir and other dir on change reload, example: watch source: '-w', watch other some dir: '-w=server -w=pkg'",
    })
    .option("clear", {
      type: "boolean",
      default: true,
      description: "On reload auto clear",
    })
    .option("gzip", {
      type: "boolean",
      description: "(only-browser) gzip watch is false, else is true",
    })
    .option("host", {
      type: "string",
      default: "127.0.0.1",
      description: "(only-browser) browser serve host",
    })
    .option("port", {
      type: "number",
      default: 13000,
      description: "(only-browser) browser serve port",
    })
    .option("path-prefix", {
      type: "string",
      default: "/",
      description: "(only-browser) public file path prefix",
    })
    .option("url-prefix", {
      type: "string",
      default: "/",
      description: "(only-browser) html file url prefix",
    })
    .option("proxy", {
      type: "array",
      description:
        "(only-browser) Example: '--proxy=/v1::http://127.0.0.1:5000' is proxy /v1 to http://127.0.0.1:5000/v1",
    })
    .option("reporter", {
      alias: "r",
      type: "string",
      description: "(only-test) c8 reporter, pick in :[text, html]",
    })
    .option("test-include", {
      type: "string",
      default: "(.test|.spec|_test|_spec)",
      description: "(only-test) test files include RegExp string",
    })
    .option("rematch", {
      type: "boolean",
      default: false,
      description: "(only-test) auto rematch all test files on watch",
    })
    .option("c8-include", {
      alias: "n",
      type: "array",
      description: "(only-test) c8 include all files",
    })
    .option("c8-exclude", {
      alias: "x",
      type: "array",
      description: "(only-test) c8 exclude all files",
    })
    .option("c8-all", {
      type: "boolean",
      default: true,
      description: "(only-test) c8 all files",
    })
    .option("c8-config", {
      type: "string",
      description: "(only-test) c8 path to JSON configuration file",
    })
    .option("c8-skip-full", {
      type: "boolean",
      description: "(only-test) c8 skip full in text that ignore in html",
    });

  const conf = confObj.parseSync();
  // 根据conf参数，初始化一些条件和逻辑
  conf.argv = argv.slice(2);

  return conf;
}

const _conf = getConfig([]);

export type Conf = typeof _conf & {
  source: string;
  afterFork: Function;
  after: Function;
  before: Function;
  "html-source": string;
  "html-entry": string;
  "html-text": string;
};
