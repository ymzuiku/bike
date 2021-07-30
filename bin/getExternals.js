const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();
const { getPkg } = require("./getPkg");

function getKeys(obj) {
  const keys = [];
  Object.keys(obj).forEach((k) => {
    const val = obj[k];
    if (/(\.).*(\/)/.test(val)) {
      return;
    }
    if (/(link\:)/.test(val)) {
      return;
    }
    keys.push(val);
  });
  return keys;
}

function getExternals(conf) {
  let externals = [
    // dev
    "esbuild",
    // nodejs
    "wasi",
    "worker_threads",
    "v8",
    "vm",
    "repl",
    "fs",
    "fs/promises",
    "path",
    "cluster",
    "http",
    "http2",
    "net",
    "os",
    "process",
    "querystring",
    "stream",
    "child_process",
    "crypto",
  ];

  const tsconfigPath = resolve(cwd, "tsconfig.json");
  const selfPkg = require(resolve(__dirname, "../package.json"));
  externals = [...externals, ...Object.keys(selfPkg.dependencies)];
  externals = [...externals, ...Object.keys(selfPkg.devDependencies)];

  const pkg = getPkg();

  if (pkg) {
    if (conf.watch && !conf.keep && pkg.dependencies) {
      externals = [...externals, ...getKeys(pkg.dependencies)];
    }
    if (pkg.devDependencies) {
      externals = [...externals, ...getKeys(pkg.devDependencies)];
    }
  }
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = require(tsconfigPath);
    if (tsconfig.exclude) {
      externals = [...externals, ...tsconfig.exclude];
    }
  }
  return Array.from(new Set(externals));
}

module.exports = { getExternals };
