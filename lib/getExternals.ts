/* c8 ignore start */
import fs from "fs-extra";
import { resolve } from "path";
import type { Conf } from "./getConfig";

const cwd = process.cwd();

function getPkg() {
  const pkgPath = resolve(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath) || null;
  }
  return null;
}

function getKeys(obj: { [key: string]: string }) {
  if (!obj) {
    return [];
  }
  const keys: string[] = [];
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

export function getExternals(conf: Conf) {
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
  externals = [
    ...externals,
    ...externals.map((v) => {
      return "node:" + v;
    }),
  ];

  const tsconfigPath = resolve(cwd, "tsconfig.json");
  const selfPkg = require(resolve(__dirname, "../package.json"));
  externals = [
    ...externals,
    ...getKeys(selfPkg.devDependencies),
    ...(selfPkg.noBundleDependencies || []),
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
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = require(tsconfigPath);
    if (tsconfig.exclude) {
      externals = [...externals, ...tsconfig.exclude];
    }
  }

  return Array.from(new Set(externals));
}
