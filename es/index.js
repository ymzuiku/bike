var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve7, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve7(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// lib/index.ts
__export(exports, {
  bike: () => bike,
  getConfig: () => getConfig,
  test: () => test
});

// lib/getConfig.ts
var import_yargs = __toModule(require("yargs"));
var import_helpers = __toModule(require("yargs/helpers"));
function getConfig(argv) {
  const confObj = (0, import_yargs.default)((0, import_helpers.hideBin)(argv)).option("argv", {
    type: "array",
    description: "Backup all argv"
  }).option("show-config", {
    type: "boolean",
    default: false,
    description: "Log cli config at run"
  }).option("src", {
    type: "string",
    default: "src",
    description: "Source dir"
  }).option("out", {
    type: "string",
    description: "Build out dir, server default dist, test default dist-test"
  }).option("outfile", {
    type: "string",
    default: "index.js",
    description: "Build out dir index name"
  }).option("public", {
    type: "string",
    default: "public",
    description: "Auto copy public's files to out"
  }).option("entry", {
    type: "string",
    description: "Main typescript file, default: ${src}/index.ts"
  }).option("base", {
    type: "string",
    default: "nodejs",
    description: "Pick in [nodejs, browser, aoife]"
  }).option("spawn", {
    type: "boolean",
    default: false,
    description: "Use child_process.spawn replace cluster.fork"
  }).option("copy", {
    type: "array",
    description: "Copy other file to dist"
  }).option("minify", {
    type: "boolean",
    description: "Esbuild minify"
  }).option("bundle", {
    type: "boolean",
    default: true,
    description: "Esbuild bundle"
  }).option("depend", {
    type: "boolean",
    default: false,
    description: "Esbuild bundle dependencies"
  }).option("external", {
    alias: "e",
    type: "array",
    description: "Esbuild external"
  }).option("define", {
    type: "string",
    description: "Esbuild define"
  }).option("target", {
    type: "string",
    default: "es6",
    description: "Esbuild target"
  }).option("splitting", {
    type: "boolean",
    description: "Esbuild splitting"
  }).option("format", {
    type: "string",
    description: "Esbuild format"
  }).option("sourcemap", {
    type: "boolean",
    default: true,
    description: "Esbuild use sourcemap"
  }).option("jsx-factory", {
    type: "string",
    description: "Esbuild jsx-factory"
  }).option("jsx-fragment", {
    type: "string",
    description: "Esbuild jsx-fragment"
  }).option("test", {
    alias: "t",
    type: "boolean",
    default: false,
    description: "Is use test"
  }).option("all", {
    type: "boolean",
    default: false,
    description: "Always test all case, ignore .bike.test.yaml"
  }).option("start", {
    type: "boolean",
    default: false,
    description: "Start server after on build"
  }).option("platform", {
    type: "string",
    default: "node",
    description: "Esbuild platform"
  }).option("watch", {
    alias: "w",
    type: "boolean",
    default: false,
    description: "Watch dir on change reload"
  }).option("clear", {
    type: "boolean",
    default: true,
    description: "On reload auto clear"
  }).option("reporter", {
    alias: "r",
    type: "string",
    description: "(only-test) c8 reporter, pick in :[text, html]"
  }).option("match", {
    type: "string",
    default: "(.test|.spec|_test|_spec)",
    description: "(only-test) test files RegExp string"
  }).option("rematch", {
    type: "boolean",
    default: false,
    description: "(only-test) auto rematch all test files on watch"
  }).option("c8-include", {
    alias: "n",
    type: "array",
    description: "(only-test) c8 include all files"
  }).option("c8-exclude", {
    alias: "x",
    type: "array",
    description: "(only-test) c8 exclude all files"
  }).option("c8-config", {
    type: "string",
    description: "(only-test) c8 path to JSON configuration file"
  }).option("c8-skip-full", {
    type: "boolean",
    description: "(only-test) c8 skip full in text that ignore in html"
  });
  const conf = confObj.parseSync();
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
  if (conf.reporter === "text" && conf["c8-skip-full"] == void 0) {
    conf["c8-skip-full"] = true;
  }
  if (!conf.entry) {
    conf.entry = conf.src + "/index.ts";
  }
  if (conf.sourcemap === void 0) {
    if (conf.watch || conf.start) {
      conf.sourcemap = true;
    }
  }
  const brower = () => {
    if (!conf.watch && !conf.start) {
      if (conf.depend === void 0) {
        conf.depend = true;
      }
      if (conf.minify === void 0) {
        conf.minify = true;
      }
    }
    if (conf.format === void 0) {
      conf.format = "esm";
    }
    if (conf.splitting === void 0) {
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
var _conf = getConfig([]);

// lib/bike.ts
var import_source_map_support = __toModule(require("source-map-support"));
var import_esbuild = __toModule(require("esbuild"));
var import_path5 = __toModule(require("path"));

// lib/getExternals.ts
var import_fs_extra = __toModule(require("fs-extra"));
var import_path = __toModule(require("path"));
var cwd = process.cwd();
function getPkg() {
  const pkgPath = (0, import_path.resolve)(cwd, "package.json");
  if (import_fs_extra.default.existsSync(pkgPath)) {
    return require(pkgPath) || null;
  }
  return null;
}
function getKeys(obj) {
  if (!obj) {
    return [];
  }
  const keys = [];
  Object.keys(obj).forEach((k) => {
    const val = obj[k];
    if (/(\.).*(\/)/.test(val)) {
      return;
    }
    if (/(link\:)/.test(val)) {
      return;
    }
    keys.push(k);
  });
  return keys;
}
function getExternals(conf) {
  let externals = [
    "assert",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "crypto",
    "dgram",
    "diagnostics_channel",
    "dns",
    "domain",
    "events",
    "fs",
    "fs/*",
    "http",
    "http2",
    "https",
    "inspector",
    "module",
    "net",
    "os",
    "path",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "tls",
    "util",
    "trace_events",
    "tty",
    "url",
    "v8",
    "vm",
    "wasi",
    "stream",
    "node:stream/*",
    "node:stream/web",
    "worker_threads",
    "zlib"
  ];
  const tsconfigPath = (0, import_path.resolve)(cwd, "tsconfig.json");
  const selfPkg = require((0, import_path.resolve)(__dirname, "../package.json"));
  externals = [...externals, ...getKeys(selfPkg.dependencies)];
  externals = [...externals, ...getKeys(selfPkg.devDependencies)];
  const pkg = getPkg();
  if (pkg) {
    if (!conf.depend && pkg.dependencies) {
      const depend = getKeys(pkg.dependencies);
      if (depend.indexOf("bike") > -1) {
        console.error("Error: bike is in package.dependencies, Please move bike to package.devDependencies.");
        process.exit();
      }
      externals = [...externals, ...depend];
    }
    if (pkg.devDependencies) {
      externals = [...externals, ...getKeys(pkg.devDependencies)];
    }
  }
  if (import_fs_extra.default.existsSync(tsconfigPath)) {
    const tsconfig = require(tsconfigPath);
    if (tsconfig.exclude) {
      externals = [...externals, ...tsconfig.exclude];
    }
  }
  return Array.from(new Set(externals));
}

// lib/child.ts
var import_child_process = __toModule(require("child_process"));
var lastChild = null;
function child(conf) {
  var _a, _b;
  if (lastChild) {
    lastChild.kill(0);
    lastChild = null;
  }
  let c8 = [];
  const c8Include = [];
  if ((_a = conf["c8-include"]) == null ? void 0 : _a.length) {
    conf["c8-include"].forEach((k) => {
      c8Include.push("--include");
      c8Include.push(k);
    });
  }
  const c8Exclude = ["./coverage", "./node_modules", ".vscode"];
  if ((_b = conf["c8-exclude"]) == null ? void 0 : _b.length) {
    conf["c8-exclude"].forEach((k) => {
      c8Exclude.push("--include");
      c8Exclude.push(k);
    });
  }
  if (conf.reporter) {
    c8 = [
      "c8",
      `-r=${conf.reporter}`,
      ...c8Include,
      ...c8Exclude,
      ...conf["c8-config"] ? ["--config", conf["c8-config"]] : [],
      conf["c8-skip-full"] == true && "--skip-full"
    ];
  }
  const ls = (0, import_child_process.spawn)("npx", [
    ...c8,
    "node",
    conf.out + "/" + conf.outfile,
    ...conf.argv,
    "--color"
  ].filter(Boolean), {
    stdio: "inherit"
  });
  lastChild = ls;
  return ls;
}

// lib/copyPackage.ts
var import_fs_extra2 = __toModule(require("fs-extra"));
var import_path2 = __toModule(require("path"));
var cwd2 = process.cwd();
function copyPackage(conf) {
  const pkgPath = (0, import_path2.resolve)(cwd2, "package.json");
  if (!import_fs_extra2.default.existsSync(pkgPath)) {
    return;
  }
  const pkg = require(pkgPath) || null;
  delete pkg.devDependencies;
  import_fs_extra2.default.writeJSONSync((0, import_path2.resolve)(conf.out, "package.json"), pkg, { spaces: 2 });
}

// lib/worker.ts
var import_cluster = __toModule(require("cluster"));
var import_path3 = __toModule(require("path"));
function getMsg(msg) {
  if (!/^bike::/.test(msg)) {
    return;
  }
  return msg.replace("bike::", "");
}
var workerFork = (conf) => {
  for (const id in import_cluster.default.workers) {
    import_cluster.default.workers[id].process.kill();
  }
  const worker = import_cluster.default.fork();
  worker.send("bike::" + JSON.stringify(conf));
  if (conf.afterFork) {
    conf.afterFork(conf, worker);
  }
};
var workerStart = () => {
  if (import_cluster.default.isWorker) {
    process.on("message", (msg) => {
      msg = getMsg(msg);
      if (!msg) {
        return;
      }
      const conf = JSON.parse(msg);
      process.on("unhandledRejection", function(err, promise) {
        console.error("[bike]", err);
      });
      try {
        if (/\.mjs/.test(conf.outfile)) {
          import((0, import_path3.resolve)(process.cwd(), conf.out + "/" + conf.outfile));
        } else {
          require((0, import_path3.resolve)(process.cwd(), conf.out + "/" + conf.outfile));
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  return import_cluster.default.isWorker;
};

// lib/keyboard.ts
var import_readline = __toModule(require("readline"));
var import_cluster2 = __toModule(require("cluster"));
var import_chalk = __toModule(require("chalk"));
var import_path4 = __toModule(require("path"));
var import_fs_extra3 = __toModule(require("fs-extra"));
var cwd3 = process.cwd();
var cacheIgnoreTestPath = (0, import_path4.resolve)(cwd3, "node_modules", ".bike.test.ignore");
var cacheTestPath = (0, import_path4.resolve)(cwd3, "node_modules", ".bike.test.json");
function parse() {
  return import_fs_extra3.default.readJSONSync(cacheTestPath);
}
function saveFile(obj) {
  import_fs_extra3.default.writeJSONSync(cacheTestPath, obj, { spaces: 2 });
}
var event = {
  focus: (num) => {
    const { all, doing } = parse();
    if (!doing[num]) {
      console.log(import_chalk.default.gray(`[bite] No have number ${num + 1} in last case, Please press key ${import_chalk.default.green("a")} reload all.`));
      return;
    }
    saveFile({ focus: [doing[num]], fails: [], all, doing });
  },
  all: () => {
    const obj = parse();
    obj.focus = [];
    obj.fails = [];
    saveFile(obj);
  }
};
var nums = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "0": 10
};
var keyboard = (conf) => {
  if (import_cluster2.default.isWorker) {
    return;
  }
  import_readline.default.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on("keypress", (_, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    } else if (key.name === "q") {
      process.exit();
    } else if (key.name === "a") {
      event.all();
    } else if (nums[key.name]) {
      event.focus(nums[key.name] - 1);
    }
  });
};

// lib/bike.ts
import_source_map_support.default.install();
var fs4 = require("fs-extra");
var cwd4 = process.cwd();
function bike(conf) {
  return __async(this, null, function* () {
    if (workerStart()) {
      return;
    }
    if (conf.test && conf.watch) {
      keyboard(conf);
    }
    if (!fs4.existsSync((0, import_path5.resolve)(cwd4, conf.out))) {
      fs4.mkdirSync((0, import_path5.resolve)(cwd4, conf.out));
    }
    const copyFiles = new Set([".env", ...conf.copy || []]);
    copyFiles.forEach((file) => {
      const p = (0, import_path5.resolve)(cwd4, file);
      if (fs4.existsSync(p)) {
        fs4.copyFileSync(p, (0, import_path5.resolve)(cwd4, conf.out, file));
      }
    });
    copyPackage(conf);
    const publicPath = (0, import_path5.resolve)(cwd4, conf.public);
    if (fs4.existsSync(publicPath)) {
      fs4.copySync(publicPath, (0, import_path5.resolve)(cwd4, conf.out));
    }
    const fork = () => {
      if (conf.spawn) {
        child(conf);
        return;
      }
      workerFork(conf);
    };
    let external = void 0;
    if (conf.bundle) {
      if (conf.external) {
        external = [...getExternals(conf), ...conf.external];
      } else {
        external = getExternals(conf);
      }
    }
    const esbuildOptions = {
      entryPoints: [(0, import_path5.resolve)(cwd4, conf.entry)],
      bundle: conf.bundle,
      target: conf.target || ["node16", "es6"],
      minify: conf.minify,
      define: conf.define,
      platform: conf.platform,
      splitting: conf.splitting,
      format: conf.format,
      jsxFactory: conf["jsx-factory"],
      jsxFragment: conf["jsx-fragment"],
      external,
      outdir: conf.splitting ? conf.out : void 0,
      outfile: conf.splitting ? void 0 : conf.out + "/" + conf.outfile,
      sourcemap: conf.sourcemap
    };
    const build = () => __async(this, null, function* () {
      if ((conf.watch || conf.start) && conf.clear) {
        console.clear();
      }
      if (conf.before) {
        yield Promise.resolve(conf.before(conf));
      }
      yield import_esbuild.default.build(esbuildOptions);
      if (conf.after) {
        conf.after(conf);
      }
    });
    try {
      yield build();
    } catch (err) {
      throw err;
    }
    if (conf.start) {
      fork();
    } else if (conf.watch) {
      fork();
      let lock = false;
      fs4.watch(conf.src, { recursive: true }, () => __async(this, null, function* () {
        if (lock) {
          return;
        }
        lock = true;
        yield build();
        fork();
        setTimeout(() => {
          lock = false;
        }, 65);
      }));
      if (!conf.all) {
        if (!fs4.existsSync(cacheTestPath)) {
          fs4.writeFileSync(cacheTestPath, "{}");
        }
        fs4.watch(cacheTestPath, () => __async(this, null, function* () {
          if (fs4.existsSync(cacheIgnoreTestPath)) {
            fs4.rmSync(cacheIgnoreTestPath);
            return;
          }
          if (lock) {
            return;
          }
          lock = true;
          yield build();
          fork();
          setTimeout(() => {
            lock = false;
          }, 65);
        }));
      }
    }
  });
}

// lib/test.ts
var import_path6 = __toModule(require("path"));
var import_fs_extra4 = __toModule(require("fs-extra"));
var cwd5 = process.cwd();
var test = (conf) => {
  conf.entry = (0, import_path6.resolve)(conf.out, "index.ts");
  if (!conf.watch) {
    conf.start = true;
  }
  const files = [];
  let waitGroup = 0;
  const reg = new RegExp(conf.match);
  function findTests(dir) {
    waitGroup += 1;
    import_fs_extra4.default.readdir(dir).then((list) => {
      list.forEach((file) => {
        waitGroup += 1;
        const p = (0, import_path6.resolve)(dir, file);
        import_fs_extra4.default.stat(p).then((stat) => {
          if (stat.isDirectory()) {
            findTests(p);
          } else if (reg.test(file)) {
            files.push(p);
          }
          waitGroup -= 1;
        });
      });
      waitGroup -= 1;
    });
  }
  if (!import_fs_extra4.default.existsSync(conf.out)) {
    import_fs_extra4.default.mkdirpSync(conf.out);
  }
  function createCode() {
    return __async(this, null, function* () {
      findTests((0, import_path6.resolve)(cwd5, conf.src));
      yield new Promise((res) => {
        const stop = setInterval(() => {
          if (waitGroup == 0) {
            clearInterval(stop);
            res(void 0);
          }
        }, 20);
      });
      const code = files.map((file) => `import "${file}";`).join("\n");
      yield import_fs_extra4.default.writeFile(conf.entry, `${code}

global.bikeTestAll = ${conf.all};
global.bikeReporter = "${conf.reporter || "none"}";
`);
    });
  }
  let createdCoded = false;
  function before() {
    return __async(this, null, function* () {
      if (!createdCoded || conf.rematch) {
        yield createCode();
        createdCoded = true;
      }
    });
  }
  bike(__spreadProps(__spreadValues({}, conf), { before }));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bike,
  getConfig,
  test
});
