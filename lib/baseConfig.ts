/* c8 ignore start */
import fs from "fs-extra";
import { resolve } from "path";
import type { Conf } from "./getConfig";

export const baseConfig = (conf: Partial<Conf>): Conf => {
  const argvs = new Set(conf.argv!);
  if (argvs.has("-w") || argvs.has("--watch")) {
    console.error(
      "Error: [--watch, -w] need input the dir path, example:",
    );
    console.error(
      "-w=src or --watch=src",
    );
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
  conf.source = conf._![0] as any;
  if (conf.gzip === undefined) {
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

  if (conf.reporter === "text" && conf["c8-skip-full"] == undefined) {
    conf["c8-skip-full"] = true;
  }

  if (!conf.entry) {
    conf.entry = conf.source + "/index.ts";
  }

  if (conf.sourcemap === undefined) {
    if (conf.isWatch || conf.start || conf.reporter) {
      conf.sourcemap = true;
    }
  }

  if (conf.target === undefined) {
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
    // 解析html
    const cwd = process.cwd();
    const htmlPath = resolve(cwd, conf.html);
    const html = fs.readFileSync(htmlPath, "utf8");
    const match = html.match(/src="(.*?).(ts|tsx)"/);
    if (match && match[0]) {
      const subMatch = match[0].match(/src="(.*?)"/);
      if (subMatch && subMatch[1]) {
        const url = subMatch[1];
        const entryPath = resolve(htmlPath, url);
        const list = entryPath.split("/").filter(Boolean);
        conf["html-source"] = list[list.length - 2];
        conf["html-entry"] = list[list.length - 2] + "/" +
          list[list.length - 1];
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

  return conf as any;
};
