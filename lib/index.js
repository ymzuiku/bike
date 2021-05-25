#!/usr/bin/env node

const argv = process.argv.splice(2);
const esbuild = require("esbuild");
const { resolve } = require("path");
const { getExternals } = require("./getExternals");
const { copyFiles } = require("./copyFiles");

const fs = require("fs-extra");
const cwd = process.cwd();
const cluster = require("cluster");
const { getPkg } = require("./getPkg");

let dist = process.env.out || "dist";
let staticDir = process.env.static || "static";

if (cluster.isWorker) {
  // 监听Promise没有被捕获的失败函数
  process.on("unhandledRejection", function (err, promise) {
    console.error("[dev-start]", err);
  });
  try {
    require(resolve(cwd, dist + "/index.js"));
  } catch (error) {
    console.error(error);
  }
  return;
}

copyFiles().forEach((file) => {
  const p = resolve(cwd, file);
  if (fs.existsSync(p)) {
    fs.copyFile(p, resolve(cwd, dist, file));
  }
});

const pkg = getPkg();
if (pkg) {
  const _pkg = JSON.parse(JSON.stringify(pkg));
  delete _pkg.devDependencies;
  fs.writeFile(
    resolve(cwd, dist, "package.json"),
    JSON.stringify(_pkg, null, 2)
  );
}

if (cluster.isMaster) {
  if (argv.length < 1) {
    throw "arvg ignore";
  }

  let entry = "index.ts";
  let isWatch = false;
  const dir = argv[0];

  argv.forEach((item) => {
    if (/-w/.test(item)) {
      isWatch = true;
    } else if (/--public/.test(item)) {
      staticDir = item.split("=")[1];
    } else if (/--entry/.test(item)) {
      entry = item.split("=")[1];
    }
  });

  const ops = {
    entryPoints: [resolve(cwd, dir, entry)],
    bundle: true,
    target: ["node14.2", "es6"],
    platform: "node",
    external: getExternals(),
    outfile: dist + "/index.js",
  };

  if (!fs.existsSync(resolve(cwd, dist))) {
    fs.mkdirSync(resolve(cwd, dist));
  }

  const publicPath = resolve(cwd, staticDir);
  if (fs.existsSync(publicPath)) {
    fs.copySync(publicPath, resolve(cwd, dist));
  }

  esbuild.buildSync(ops);

  const fork = () => {
    for (const id in cluster.workers) {
      cluster.workers[id].process.kill();
    }
    cluster.fork();
  };
  if (isWatch) {
    fork();
    fs.watch(dir, { recursive: true }, (e, f) => {
      esbuild.buildSync(ops);
      fork();
    });
  }
}
