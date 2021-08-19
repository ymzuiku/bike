/* c8 ignore start */
import fs from "fs-extra";
import { resolve } from "path";
import type { Conf } from "./getConfig";

export const baseConfig = (conf: Partial<Conf>): Conf => {
  if ((!conf._ || !conf._[0]) && !conf.html) {
    console.log("Need input source dir, like: bike src");
    process.exit();
  }
  conf.source = conf._![0] as any;
  if (conf.gzip === undefined) {
    if (conf.watch || conf.start) {
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
      conf.out = "dist";
    }
  }

  if (conf.reporter === "text" && conf["c8-skip-full"] == undefined) {
    conf["c8-skip-full"] = true;
  }

  if (!conf.entry) {
    conf.entry = conf.source + "/index.ts";
  }

  if (conf.sourcemap === undefined) {
    if (conf.watch || conf.start || conf.reporter) {
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

  const brower = () => {
    conf.platform = "neutral";
    if (!conf.watch && !conf.start) {
      if (conf.minify === undefined) {
        conf.minify = true;
      }
      if (conf.sourcemap === undefined) {
        conf.sourcemap = false;
      }
    }
    if (conf.depend === undefined) {
      conf.depend = true;
    }
    if (conf.format === undefined) {
      conf.format = "esm";
    }
    if (conf.splitting === undefined) {
      conf.splitting = true;
    }
  };

  if (conf.html) {
    // 解析html
    const htmlPath = resolve(process.cwd(), "index.html");
    const html = fs.readFileSync(htmlPath, "utf8");
    const match = html.match(/src="(.*?).(ts|tsx)"/);
    if (match && match[0]) {
      const subMatch = match[0].match(/src="(.*?)"/);
      if (subMatch && subMatch[1]) {
        const url = subMatch[1];
        const [src, entry] = url.split("/").filter(Boolean);
        conf["html-source"] = src;
        conf["html-entry"] = src + "/" + entry;
        conf["html-out"] = "dist/www";
      }
    }
    conf["html-text"] = html.replace(/src="(.*?)"/, 'src="/index.js?bike=1"');
    brower();
  }

  if (conf["log-config"]) {
    console.log(conf);
    console.log(" ");
    console.log("Stop with only log config");
    process.exit();
  }

  return conf as any;
};
