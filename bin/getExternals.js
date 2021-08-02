const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();

function getPkg() {
  const pkgPath = resolve(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath) || null;
  }
  return null;
}

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
    "zlib",
  ];

  const tsconfigPath = resolve(cwd, "tsconfig.json");
  const selfPkg = require(resolve(__dirname, "../package.json"));
  externals = [...externals, ...Object.keys(selfPkg.dependencies)];
  externals = [...externals, ...Object.keys(selfPkg.devDependencies)];

  const pkg = getPkg();

  if (pkg) {
    if (!conf.depend && pkg.dependencies) {
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
