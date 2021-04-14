#!/usr/bin/env node

const argv = process.argv.splice(2);
const esbuild = require("esbuild");
const { resolve } = require("path");
const { getExternals } = require("./getExternals");

const fs = require("fs-extra");
const cwd = process.cwd();
const cluster = require("cluster");

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

if (cluster.isMaster) {
  if (argv.length < 1) {
    throw "arvg ignore";
  }

  let entry = "index.ts";
  let isBuild = false;
  const dir = argv[0];

  argv.forEach((item) => {
    if (/--build/.test(item)) {
      isBuild = true;
    } else if (/--public/.test(item)) {
      staticDir = item.split("=")[1];
    } else if (/--entry/.test(item)) {
      entry = item.split("=")[1];
    }
  });

  const ops = {
    entryPoints: [resolve(cwd, dir, entry)],
    bundle: true,
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
  if (!isBuild) {
    fork();
    fs.watch(dir, { recursive: true }, (e, f) => {
      esbuild.buildSync(ops);
      fork();
    });
  }
}
