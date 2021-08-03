import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export function getConfig(argv: string[]) {
  const confObj = yargs(hideBin(argv))
    .option("argv", {
      type: "array",
      description: "Backup all argv",
    })
    .option("show-config", {
      type: "boolean",
      default: false,
      description: "Log cli config at run",
    })
    .option("src", {
      type: "string",
      default: "src",
      description: "Source dir",
    })
    .option("out", {
      type: "string",
      description: "Build out dir, server default dist, test default dist-test",
    })
    .option("outfile", {
      type: "string",
      default: "index.js",
      description: "Build out dir index name",
    })
    .option("public", {
      type: "string",
      default: "public",
      description: "Auto copy public's files to out",
    })
    .option("entry", {
      type: "string",
      description: "Main typescript file, default: ${src}/index.ts",
    })
    .option("base", {
      type: "string",
      default: "nodejs",
      description: "Pick in [nodejs, browser, aoife]",
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
      default: false,
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
      default: "es6",
      description: "Esbuild target",
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
      default: true,
      description: "Esbuild use sourcemap",
    })
    .option("jsx-factory", {
      type: "string",
      description: "Esbuild jsx-factory",
    })
    .option("jsx-fragment", {
      type: "string",
      description: "Esbuild jsx-fragment",
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
      description: "(only-test) c8 reporter, pick in :[text, html]",
    })
    .option("match", {
      type: "string",
      default: "(.test|.spec|_test|_spec)",
      description: "(only-test) test files RegExp string",
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

  if (conf.reporter === "text" || conf.reporter === "html") {
    conf.test = true;
    conf.spawn = true;
  }

  if (!conf.out) {
    if (conf.test) {
      conf.out = "dist-test";
    } else {
      conf.out = "dist";
    }
  }

  if (conf.reporter === "text" && conf["c8-skip-full"] == undefined) {
    conf["c8-skip-full"] = true;
  }

  if (!conf.entry) {
    conf.entry = conf.src + "/index.ts";
  }

  if (conf.sourcemap === undefined) {
    if (conf.watch || conf.start) {
      conf.sourcemap = true;
    }
  }

  const brower = () => {
    if (!conf.watch && !conf.start) {
      if (conf.depend === undefined) {
        conf.depend = true;
      }
      if (conf.minify === undefined) {
        conf.minify = true;
      }
    }
    if (conf.format === undefined) {
      conf.format = "esm";
    }
    if (conf.splitting === undefined) {
      conf.splitting = true;
    }
  };

  if (conf.base === "browser") {
    brower();
  } else if (conf.base === "aoife") {
    brower();
    if (!conf["jsx-factory"]) {
      conf["jsx-factory"] = "aoife";
    }
    if (!conf["jsx-fragment"]) {
      conf["jsx-fragment"] = "aoife.Frag";
    }
  }

  if (conf["show-config"]) {
    delete (conf as any)["$0"];
    delete (conf as any)["_"];
    Object.keys(conf).forEach((k) => {
      if (/-/.test(k) || k.length === 1) {
        delete conf[k];
      }
    });
    console.log(conf);
    console.log(" ");
    console.log("Stop with only show config");
    process.exit();
  }

  return conf;
}

const _conf = getConfig([]);

export type Conf = typeof _conf & {
  afterFork: Function;
  after: Function;
  before: Function;
};
