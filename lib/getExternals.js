const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();
const { getPkg } = require("./getPkg");

function getExternals() {
  let externals = [
    // nodejs
    "wasi",
    "worker_threads",
    "v8",
    "vm",
    "repl",
    "esbuild",
    "fs",
    "fs/promises",
    "fs-extra",
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
    if (pkg.dependencies) {
      externals = [...externals, ...Object.keys(pkg.dependencies)];
    }
    if (pkg.devDependencies) {
      externals = [...externals, ...Object.keys(pkg.devDependencies)];
    }
    if (pkg.keepDependencies) {
      const keep = new Set(Object.keys(pkg.keepDependencies));
      let nextExtr = [];
      externals.forEach((v) => {
        if (!keep.has(v)) {
          nextExtr.push(v);
        }
      });
      externals = nextExtr;
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
