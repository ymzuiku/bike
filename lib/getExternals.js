const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();

function getExternals() {
  const pkgPath = resolve(cwd, "package.json");
  let externals = [
    "express",
    "wasi",
    "worker_threads",
    "v8",
    "vm",
    "repl",
    "esbuild",
    "fs",
    "path",
    "cluster",
    "fs/promises",
    "fs",
    "fs-extra",
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

  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
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
  return externals;
}

module.exports = { getExternals };
