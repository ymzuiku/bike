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
  return new Promise((resolve8, reject) => {
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
    var step = (x) => x.done ? resolve8(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// lib/index.ts
__export(exports, {
  bike: () => bike,
  getConfig: () => getConfig,
  test: () => test
});
var import_source_map_support = __toModule(require("source-map-support"));

// lib/getConfig.ts
var import_yargs = __toModule(require("yargs"));
var import_helpers = __toModule(require("yargs/helpers"));
function getConfig(argv) {
  const confObj = (0, import_yargs.default)((0, import_helpers.hideBin)(argv)).option("argv", {
    type: "array",
    description: "Backup all argv"
  }).option("log-config", {
    type: "boolean",
    default: false,
    description: "Log cli config at run"
  }).option("browser", {
    type: "boolean",
    description: "Use build browser types"
  }).option("html", {
    alias: "h",
    type: "string",
    description: "Use base html When type is browser"
  }).option("html-out", {
    type: "string",
    description: "Build client out dir, server default dist/client"
  }).option("out", {
    type: "string",
    description: "Build out dir, server default dist/server, test default dist/test"
  }).option("outfile", {
    type: "string",
    default: "index.js",
    description: "Build out dir index name"
  }).option("static", {
    type: "string",
    default: "static",
    description: "Auto copy static's files to out"
  }).option("public", {
    type: "string",
    default: "public",
    description: "Auto copy public's files to html-out"
  }).option("entry", {
    type: "string",
    description: "Main typescript file, default: ${source}/index.ts"
  }).option("spawn", {
    type: "boolean",
    default: false,
    description: "Use child_process.spawn replace cluster.fork"
  }).option("copy", {
    type: "array",
    description: "Copy other file to dist"
  }).option("minify", {
    alias: "m",
    type: "boolean",
    description: "Esbuild minify"
  }).option("bundle", {
    type: "boolean",
    default: true,
    description: "Esbuild bundle"
  }).option("depend", {
    type: "boolean",
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
    default: "es2018",
    description: "Esbuild target, browser default: es6, nodejs default: es2018"
  }).option("splitting", {
    type: "boolean",
    description: "Esbuild splitting"
  }).option("format", {
    type: "string",
    description: "Esbuild format"
  }).option("sourcemap", {
    type: "boolean",
    description: "Esbuild use sourcemap"
  }).option("test", {
    alias: "t",
    type: "boolean",
    default: false,
    description: "Is use test"
  }).option("all", {
    type: "boolean",
    default: false,
    description: "Always test all case, ignore .bike.test.yaml"
  }).option("focus", {
    alias: "f",
    type: "string",
    description: "Use RegExp focus some test"
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
    type: "array",
    default: [],
    description: "Watch some dir on change reload, example: '-w=server -w=pkg'"
  }).option("clear", {
    type: "boolean",
    default: true,
    description: "On reload auto clear"
  }).option("gzip", {
    type: "boolean",
    description: "(only-browser) gzip watch is false, else is true"
  }).option("host", {
    type: "string",
    default: "127.0.0.1",
    description: "(only-browser) browser serve host"
  }).option("port", {
    type: "number",
    default: 13e3,
    description: "(only-browser) browser serve port"
  }).option("path-prefix", {
    type: "string",
    default: "/",
    description: "(only-browser) public file path prefix"
  }).option("url-prefix", {
    type: "string",
    default: "/",
    description: "(only-browser) html file url prefix"
  }).option("proxy", {
    type: "array",
    description: "(only-browser) Example: '--proxy=/v1::http://127.0.0.1:5000' is proxy /v1 to http://127.0.0.1:5000/v1"
  }).option("reporter", {
    alias: "r",
    type: "string",
    description: "(only-test) c8 reporter, pick in :[text, html]"
  }).option("test-include", {
    type: "string",
    default: "(.test|.spec|_test|_spec)",
    description: "(only-test) test files include RegExp string"
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
  }).option("c8-all", {
    type: "boolean",
    default: true,
    description: "(only-test) c8 all files"
  }).option("c8-config", {
    type: "string",
    description: "(only-test) c8 path to JSON configuration file"
  }).option("c8-skip-full", {
    type: "boolean",
    description: "(only-test) c8 skip full in text that ignore in html"
  });
  const conf = confObj.parseSync();
  conf.argv = argv.slice(2);
  return conf;
}
var _conf = getConfig([]);

// lib/bike.ts
var import_esbuild = __toModule(require("esbuild"));
var import_path8 = __toModule(require("path"));

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
  externals = [
    ...externals,
    ...externals.map((v) => {
      return "node:" + v;
    })
  ];
  const tsconfigPath = (0, import_path.resolve)(cwd, "tsconfig.json");
  const selfPkg = require((0, import_path.resolve)(__dirname, "../package.json"));
  externals = [
    ...externals,
    ...getKeys(selfPkg.devDependencies),
    ...selfPkg.noBundleDependencies || []
  ];
  const pkg = getPkg();
  if (pkg) {
    if (!conf.depend && pkg.dependencies) {
      const depend = getKeys(pkg.dependencies);
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

// lib/spawn.ts
var import_child_process = __toModule(require("child_process"));
var import_path2 = __toModule(require("path"));
var lastChild = null;
var cwd2 = process.cwd();
function spawn(conf) {
  var _a, _b;
  if (lastChild) {
    lastChild.kill(0);
    lastChild = null;
  }
  let c8 = [];
  const defaultExtension = [".js", ".cjs", ".mjs", ".ts", ".tsx", ".jsx"];
  const testFileExtensions = defaultExtension.map((extension) => extension.slice(1)).join(",");
  const _c8Include = [];
  if ((_a = conf["c8-include"]) == null ? void 0 : _a.length) {
    conf["c8-include"].forEach((k) => {
      _c8Include.push(k);
    });
  }
  const c8Include = [];
  _c8Include.forEach((k) => {
    c8Include.push("--include");
    c8Include.push(k);
  });
  const _c8Exclude = [
    "coverage/**",
    "packages/*/test{,s}/**",
    "**/*.d.ts",
    "test{,s}/**",
    `test{,-*}.{${testFileExtensions}}`,
    `**/*{.,-}test.{${testFileExtensions}}`,
    "**/__tests__/**",
    "**/{ava,babel,nyc}.config.{js,cjs,mjs}",
    "**/jest.config.{js,cjs,mjs,ts}",
    "**/{karma,rollup,webpack}.config.js",
    "**/.{eslint,mocha}rc.{js,cjs}"
  ];
  if ((_b = conf["c8-exclude"]) == null ? void 0 : _b.length) {
    conf["c8-exclude"].forEach((k) => {
      _c8Exclude.push(k);
    });
  }
  const c8Exclude = [];
  _c8Exclude.forEach((k) => {
    c8Exclude.push("--exclude");
    c8Exclude.push(k);
  });
  if (conf.reporter) {
    c8 = [
      "c8",
      `-r=${conf.reporter}`,
      "--src",
      import_path2.default.resolve(cwd2, conf.source),
      ...c8Include,
      ...c8Exclude,
      conf["c8-all"] && "--all",
      conf["c8-skip-full"] == true && "--skip-full"
    ].filter(Boolean);
  }
  const ls = import_child_process.default.spawn("npx", [
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
var import_path3 = __toModule(require("path"));
var cwd3 = process.cwd();
function copyPackage(conf) {
  const pkgPath = (0, import_path3.resolve)(cwd3, "package.json");
  if (!import_fs_extra2.default.existsSync(pkgPath)) {
    return;
  }
  const pkg = require(pkgPath) || null;
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg["lint-staged"];
  if (conf.depend && pkg.dependencies) {
    if (!pkg.noBundleDependencies) {
      delete pkg.dependencies;
    } else {
      const oldDepend = pkg.dependencies;
      pkg.dependencies = {};
      pkg.noBundleDependencies.forEach((k) => {
        pkg.dependencies[k] = oldDepend[k];
      });
    }
  }
  import_fs_extra2.default.writeJSONSync((0, import_path3.resolve)(conf.out, "package.json"), pkg, { spaces: 2 });
  ["pnpm-lock.yaml", "yarn.lock", "package-lock.json"].forEach((v) => {
    if (import_fs_extra2.default.existsSync((0, import_path3.resolve)(cwd3, v))) {
      import_fs_extra2.default.copySync((0, import_path3.resolve)(cwd3, v), (0, import_path3.resolve)(conf.out, v));
    }
  });
}

// lib/worker.ts
var import_cluster = __toModule(require("cluster"));
var import_path4 = __toModule(require("path"));
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
          import((0, import_path4.resolve)(process.cwd(), conf.out + "/" + conf.outfile));
        } else {
          require((0, import_path4.resolve)(process.cwd(), conf.out + "/" + conf.outfile));
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
var import_path5 = __toModule(require("path"));
var import_fs_extra3 = __toModule(require("fs-extra"));
var cwd4 = process.cwd();
var cacheIgnoreTestPath = (0, import_path5.resolve)(cwd4, "node_modules", ".bike.test.ignore");
var cacheTestPath = (0, import_path5.resolve)(cwd4, "node_modules", ".bike.test.json");
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
var keyboard = (conf, reload) => {
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
      reload();
    } else if (nums[key.name]) {
      event.focus(nums[key.name] - 1);
      reload();
    }
  });
};

// lib/devServe.ts
var import_fastify = __toModule(require("fastify"));
var import_fastify_websocket = __toModule(require("fastify-websocket"));
var import_fs_extra4 = __toModule(require("fs-extra"));
var import_path6 = __toModule(require("path"));
var import_fastify_http_proxy = __toModule(require("fastify-http-proxy"));
var import_fastify_static = __toModule(require("fastify-static"));
var import_fastify_compress = __toModule(require("fastify-compress"));
var import_crypto = __toModule(require("crypto"));
var cwd5 = process.cwd();
var reloadLog = () => {
};
var wsList = new Set();
var devServe = (conf) => {
  if (!conf.watch) {
    return;
  }
  const htmlPath = (0, import_path6.resolve)(conf["html-out"], "index.html");
  const { gzip, host, port, proxy } = conf;
  const publicPrefix = conf["path-prefix"];
  const app = (0, import_fastify.fastify)();
  if (proxy) {
    proxy.forEach((p) => {
      const [prefix, other] = p.split("::");
      const opt = {
        prefix,
        upstream: other + prefix,
        rewritePrefix: prefix,
        http2: false
      };
      app.register(import_fastify_http_proxy.default, opt);
    });
  }
  if (gzip) {
    app.register(import_fastify_compress.default, { global: true });
  }
  app.register(import_fastify_static.default, {
    root: (0, import_path6.resolve)(cwd5, conf["html-out"]),
    prefix: publicPrefix
  });
  app.register(import_fastify_websocket.default);
  app.get("/", function(req, rep) {
    var html = import_fs_extra4.default.readFileSync(htmlPath, "utf8");
    html = html.replace("</html>", "");
    html += `<script>${devHot}<\/script></html>`;
    rep.code(200).header("Content-Type", "text/html; charset=utf-8").send(html);
  });
  app.get("/devhot", { websocket: true }, (connection) => {
    connection.socket.on("message", (msg) => {
      if (msg === "reload") {
        wsList.add(connection.socket);
      }
    });
  });
  app.listen(port, host, () => {
    reloadLog = () => {
      console.log(`Client dev server listen: http://${host}:${port}`);
    };
  });
};
var releaseBrowser = (conf) => {
  const urlPrefix = conf["url-prefix"];
  import_fs_extra4.default.readdirSync(conf["html-out"]).forEach((file) => {
    if (file !== "index.css" && /\.(css)/.test(file)) {
      import_fs_extra4.default.remove((0, import_path6.resolve)(conf["html-out"], file));
    }
  });
  let cssKey = "";
  if (import_fs_extra4.default.existsSync((0, import_path6.resolve)(conf["html-out"], "index.css"))) {
    const indexCss = import_fs_extra4.default.readFileSync((0, import_path6.resolve)(conf["html-out"], "index.css"));
    cssKey = (0, import_crypto.createHmac)("sha256", "bike").update(indexCss).digest("hex").slice(5, 13);
    import_fs_extra4.default.renameSync((0, import_path6.resolve)(conf["html-out"], "index.css"), (0, import_path6.resolve)(conf["html-out"], `index-${cssKey}.css`));
  }
  const indexJS = import_fs_extra4.default.readFileSync((0, import_path6.resolve)(conf["html-out"], "index.js"));
  const key = (0, import_crypto.createHmac)("sha256", "bike").update(indexJS).digest("hex").slice(5, 13);
  import_fs_extra4.default.renameSync((0, import_path6.resolve)(conf["html-out"], "index.js"), (0, import_path6.resolve)(conf["html-out"], `index-${key}.js`));
  const _html = replaceCss(conf, `index-${cssKey}.css`).replace("/index.js?bike=1", `${urlPrefix}index-${key}.js`);
  import_fs_extra4.default.writeFileSync((0, import_path6.resolve)(conf["html-out"], "index.html"), _html);
};
var keep = null;
var onBuilded = (conf) => {
  if (keep) {
    clearTimeout(keep);
    keep = null;
  }
  replaceCss(conf, "index.css");
  reloadLog();
  keep = setTimeout(() => {
    wsList.forEach((ws) => {
      if (ws.readyState != 1) {
        wsList.delete(ws);
        return;
      }
      try {
        ws.send("reload");
      } catch (err) {
        console.error(err);
        wsList.delete(ws);
      }
    });
  }, 66);
};
function replaceCss(conf, name) {
  const urlPrefix = conf["url-prefix"];
  const css = `<link rel="stylesheet" href="${urlPrefix}${name}" />
`;
  const _html = conf["html-text"].replace("</head>", css + "</head/>");
  import_fs_extra4.default.writeFileSync((0, import_path6.resolve)(conf["html-out"], "index.html"), _html);
  return _html;
}
var devHot = `(function () {
  window.devHot = true;
  let ws = new WebSocket("ws://" + location.host + "/devhot");
  ws.onmessage = (env) => {
    if (env.data === "reload") {
      window.location.reload();
    }
  };
  ws.onopen = () => {
    if (ws.readyState > 0) {
      console.log("[bike-hot] start");
      ws.send("reload");
    }
  };
  ws.onclose = () => {
    console.log("[bike-hot] closed");
    reStart();
  };
  ws.onerror = () => {
    console.log("[bike-hot] error");
    reStart();
  };

  let checker;
  const reStart = () => {
    console.log("[bike-hot] reconnect");
    if (checker) {
      checker.close();
    }
    checker = null;
    checker = new WebSocket("ws://" + location.host + "/devhot");
    checker.onopen = () => {
      if (checker.readyState > 0) {
        window.location.reload();
      }
    };
    setTimeout(reStart, 2000);
  };
})();`;

// lib/bike.ts
var import_fs_extra7 = __toModule(require("fs-extra"));

// lib/baseConfig.ts
var import_fs_extra5 = __toModule(require("fs-extra"));
var import_path7 = __toModule(require("path"));
var baseConfig = (conf) => {
  const argvs = new Set(conf.argv);
  if (argvs.has("-w") || argvs.has("--watch")) {
    console.error("Error: [--watch, -w] need input the dir path, example:");
    console.error("-w=src or --watch=src");
    process.exit();
  }
  conf.isWatch = false;
  if (Array.isArray(conf.watch) && conf.watch.length > 0) {
    conf.isWatch = true;
  }
  if ((!conf._ || !conf._[0]) && !conf.html) {
    console.log("Need input source dir, like: bike src");
    process.exit();
  }
  conf.source = conf._[0];
  if (conf.gzip === void 0) {
    if (conf.isWatch || conf.start) {
      conf.gzip = false;
    } else {
      conf.gzip = true;
    }
  }
  if (conf.reporter === "text" || conf.reporter === "html") {
    conf.test = true;
    conf.spawn = true;
  }
  if (!conf.out) {
    if (conf.test) {
      conf.out = "dist/test";
    } else {
      conf.out = "dist/server";
    }
  }
  if (conf.reporter === "text" && conf["c8-skip-full"] == void 0) {
    conf["c8-skip-full"] = true;
  }
  if (!conf.entry) {
    conf.entry = conf.source + "/index.ts";
  }
  if (conf.sourcemap === void 0) {
    if (conf.isWatch || conf.start || conf.reporter) {
      conf.sourcemap = true;
    }
  }
  if (conf.target === void 0) {
    if (conf.html) {
      conf.target = "es6";
    } else {
      conf.target = "esnext";
    }
  }
  if (conf.html) {
    if (!conf["html-out"]) {
      conf["html-out"] = "dist/client";
    }
    const cwd8 = process.cwd();
    const htmlPath = (0, import_path7.resolve)(cwd8, conf.html);
    const html = import_fs_extra5.default.readFileSync(htmlPath, "utf8");
    const match = html.match(/src="(.*?).(ts|tsx)"/);
    if (match && match[0]) {
      const subMatch = match[0].match(/src="(.*?)"/);
      if (subMatch && subMatch[1]) {
        const url = subMatch[1];
        const entryPath = (0, import_path7.resolve)(htmlPath, url);
        const list = entryPath.split("/").filter(Boolean);
        conf["html-source"] = list[list.length - 2];
        conf["html-entry"] = list[list.length - 2] + "/" + list[list.length - 1];
      }
    }
    conf["html-text"] = html.replace(/src="(.*?)"/, 'src="/index.js?bike=1"');
  }
  if (conf["log-config"]) {
    console.log(conf);
    console.log(" ");
    console.log("Stop with only log config");
    process.exit();
  }
  return conf;
};

// lib/watch.ts
var import_chokidar = __toModule(require("chokidar"));
var import_fs_extra6 = __toModule(require("fs-extra"));
var import_os = __toModule(require("os"));
var watch = (uri, event2, timeout = 65) => {
  let lock = false;
  const fn = () => __async(void 0, null, function* () {
    if (lock) {
      return;
    }
    lock = true;
    yield Promise.resolve(event2());
    setTimeout(() => {
      lock = false;
    }, timeout);
  });
  if (/(darwin|window)/.test(import_os.default.type().toLowerCase())) {
    if (import_fs_extra6.default.statSync(uri).isDirectory()) {
      import_fs_extra6.default.watch(uri, { recursive: true }, fn);
    } else {
      import_fs_extra6.default.watchFile(uri, fn);
    }
  } else {
    import_chokidar.default.watch(uri).on("all", fn);
  }
};

// lib/bike.ts
var cwd6 = process.cwd();
function bike(config) {
  return __async(this, null, function* () {
    const conf = baseConfig(config);
    if (workerStart()) {
      return;
    }
    if (conf.html) {
      import_fs_extra7.default.removeSync((0, import_path8.resolve)(cwd6, conf["html-out"]));
      if (!import_fs_extra7.default.existsSync((0, import_path8.resolve)(cwd6, conf["html-out"]))) {
        import_fs_extra7.default.mkdirpSync((0, import_path8.resolve)(cwd6, conf["html-out"]));
      }
      const publicPath = (0, import_path8.resolve)(cwd6, conf.public);
      if (import_fs_extra7.default.existsSync(publicPath)) {
        import_fs_extra7.default.copySync(publicPath, (0, import_path8.resolve)(cwd6, conf["html-out"]));
      }
      const htmlPath = (0, import_path8.resolve)(cwd6, conf["html-out"], "index.html");
      import_fs_extra7.default.writeFileSync(htmlPath, conf["html-text"]);
      if (conf.isWatch) {
        devServe(conf);
      }
    }
    if (conf.source) {
      import_fs_extra7.default.removeSync((0, import_path8.resolve)(cwd6, conf.out));
      if (!import_fs_extra7.default.existsSync((0, import_path8.resolve)(cwd6, conf.out))) {
        import_fs_extra7.default.mkdirpSync((0, import_path8.resolve)(cwd6, conf.out));
      }
      if (!conf.browser) {
        const copyFiles = new Set([".env", ...conf.copy || []].filter(Boolean));
        copyFiles.forEach((file) => {
          const p = (0, import_path8.resolve)(cwd6, file);
          if (import_fs_extra7.default.existsSync(p)) {
            import_fs_extra7.default.copyFileSync(p, (0, import_path8.resolve)(cwd6, conf.out, file));
          }
        });
        const staticPath = (0, import_path8.resolve)(cwd6, conf.static);
        if (import_fs_extra7.default.existsSync(staticPath)) {
          import_fs_extra7.default.copySync(staticPath, (0, import_path8.resolve)(cwd6, conf.out));
        }
        copyPackage(conf);
      }
    }
    let external = void 0;
    if (conf.bundle) {
      if (conf.external) {
        external = [...getExternals(conf), ...conf.external];
      } else {
        external = getExternals(conf);
      }
    }
    let esbuildOptions;
    let esbuildHTMLOptions;
    if (conf.source) {
      if (conf.browser) {
        esbuildOptions = {
          entryPoints: [(0, import_path8.resolve)(cwd6, conf["entry"])],
          bundle: true,
          target: ["es6"],
          minify: !conf.isWatch,
          platform: "neutral",
          splitting: conf.splitting,
          format: conf.format || "cjs",
          outdir: conf["out"],
          sourcemap: !conf.isWatch
        };
      } else {
        esbuildOptions = {
          entryPoints: [(0, import_path8.resolve)(cwd6, conf.entry)],
          bundle: conf.bundle,
          target: conf.target || ["node16", "es6"],
          minify: conf.minify,
          define: conf.define,
          platform: conf.platform,
          splitting: conf.splitting,
          format: conf.format,
          external,
          outdir: conf.splitting ? conf.out : void 0,
          outfile: conf.splitting ? void 0 : conf.out + "/" + conf.outfile,
          sourcemap: conf.sourcemap
        };
      }
    }
    if (conf.html) {
      esbuildHTMLOptions = {
        entryPoints: [(0, import_path8.resolve)(cwd6, conf["html-entry"])],
        bundle: true,
        target: ["es6"],
        minify: !conf.isWatch,
        platform: "neutral",
        splitting: true,
        format: conf.format || "esm",
        outdir: conf["html-out"],
        sourcemap: !conf.isWatch
      };
    }
    const build = () => __async(this, null, function* () {
      if (conf.test) {
        console.clear();
      }
      if (conf.before) {
        yield Promise.resolve(conf.before(conf));
      }
      if (conf.source) {
        yield import_esbuild.default.build(esbuildOptions);
      }
      if (conf.after) {
        conf.after(conf);
      }
      if (!conf.isWatch && !conf.start) {
        console.log("release server done.");
      }
    });
    const buildHTML = () => __async(this, null, function* () {
      yield import_esbuild.default.build(esbuildHTMLOptions);
      if (!conf.isWatch && !conf.start) {
        releaseBrowser(conf);
        console.log("release html done.");
      }
    });
    const reload = () => {
      if (conf.source) {
        if (conf.spawn) {
          return spawn(conf);
        }
        workerFork(conf);
      }
    };
    const reloadHTML = () => {
      if (conf.html) {
        onBuilded(conf);
      }
    };
    try {
      if (conf.source) {
        yield build();
      }
      if (conf.html) {
        yield buildHTML();
      }
    } catch (err) {
      throw err;
    }
    if (conf.start) {
      reload();
      reloadHTML();
    } else if (conf.isWatch) {
      reload();
      reloadHTML();
      const onWatch = () => __async(this, null, function* () {
        yield build();
        reload();
      });
      if (conf.source) {
        conf.source.split(",").forEach((src) => {
          watch(src, onWatch);
        });
      }
      if (Array.isArray(conf.watch)) {
        conf.watch.forEach((src) => {
          if (typeof src == "string") {
            watch(src, onWatch);
          }
        });
      }
      if (conf.html) {
        watch(conf["html-source"], () => __async(this, null, function* () {
          yield buildHTML();
          reloadHTML();
        }));
      }
      if (conf.test) {
        keyboard(conf, onWatch);
      }
    }
  });
}

// lib/test.ts
var import_path9 = __toModule(require("path"));
var import_fs_extra8 = __toModule(require("fs-extra"));
var cwd7 = process.cwd();
var test = (config) => {
  if (!config.watch) {
    config.start = true;
  }
  const conf = baseConfig(config);
  conf.entry = import_path9.default.resolve(conf.out, "bike.temp.ts");
  const files = [];
  let waitGroup = 0;
  const include = new RegExp(conf["test-include"]);
  function findTests(dir) {
    waitGroup += 1;
    import_fs_extra8.default.readdir(dir).then((list) => {
      list.forEach((file) => {
        waitGroup += 1;
        const p = import_path9.default.resolve(dir, file);
        import_fs_extra8.default.stat(p).then((stat) => {
          if (stat.isDirectory()) {
            findTests(p);
          } else if (include.test(file)) {
            files.push(p);
          }
          waitGroup -= 1;
        });
      });
      waitGroup -= 1;
    });
  }
  if (!import_fs_extra8.default.existsSync(conf.out)) {
    import_fs_extra8.default.mkdirpSync(conf.out);
  }
  function createCode() {
    return __async(this, null, function* () {
      conf.source.split(",").forEach((src) => {
        findTests(import_path9.default.resolve(cwd7, src));
      });
      yield new Promise((res) => {
        const stop = setInterval(() => {
          if (waitGroup == 0) {
            clearInterval(stop);
            res(void 0);
          }
        }, 20);
      });
      const code = files.map((file) => {
        file = import_path9.default.relative(import_path9.default.join(cwd7, conf.out), file);
        file = file.replace(/\.(tsx|jsx)/g, "");
        file = file.replace(/\.(ts|js)/g, "");
        file = file.replace(/\\/g, "/");
        return `import("${file}");`;
      }).join("\n");
      yield import_fs_extra8.default.writeFile(conf.entry, `/* c8 ignore start */
// THIS FILE IS AUTO GENERATE, DON'T EDIT.
// tslint:disable
/* eslint-disable */
(global as any).fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const win = new JSDOM("", { pretendToBeVisual: true }).window;
(global as any).window = win;
(global as any).document = win.document;
(global as any).bikeConf = ${JSON.stringify(conf)};
${code}
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

// lib/index.ts
import_source_map_support.default.install();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bike,
  getConfig,
  test
});
//# sourceMappingURL=index.js.map
