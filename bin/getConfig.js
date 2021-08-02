const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

function getConfig(argv) {
  const conf = yargs(hideBin(argv))
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
    .option("public", {
      type: "string",
      default: "public",
      description: "Auto copy public's files to out",
    })
    .option("entry", {
      type: "string",
      description: "Main typescript file, default: ${src}/index.ts",
    })
    .option("lib", {
      type: "boolean",
      default: false,
      description: "If lib is true, not compiler dependencies",
    })
    .option("base", {
      type: "string",
      default: "nodejs",
      description: "Pick in nodejs, browser, aoife",
    })
    .option("minify", {
      type: "boolean",
      description: "Esbuild minify",
    })
    .option("copy", {
      type: "array",
      description: "copy file to dist",
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
      default: false,
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

  if (conf.reporter === "text" || conf.reporter === "html") {
    conf.test = true;
  }

  if (!conf.out) {
    if (conf.test) {
      conf.out = "dist-test";
    } else {
      conf.out = "dist";
    }
  }

  if (conf.reporter === "text" && conf["skip-full"] == undefined) {
    conf["skip-full"] = true;
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
    delete conf["$0"];
    delete conf["_"];
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

module.exports = getConfig;
