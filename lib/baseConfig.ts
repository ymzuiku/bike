import fs from "fs-extra";
import { resolve } from "path";
import type { Conf } from "./getConfig";

export const baseConfig = (conf: Partial<Conf>): Conf => {
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
      conf.out = "dist-test";
    } else {
      conf.out = "dist";
    }
  }

  if (conf.reporter === "text" && conf["c8-skip-full"] == undefined) {
    conf["c8-skip-full"] = true;
  }

  if (!conf.entry) {
    conf.entry = conf.by + "/index.ts";
  }

  if (conf.sourcemap === undefined) {
    if (conf.watch || conf.start || conf.reporter) {
      conf.sourcemap = true;
    }
  }

  if (conf.target === undefined) {
    if (conf.browser) {
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

  if (conf.browser) {
    // 解析html
    const htmlPath = resolve(process.cwd(), "index.html");
    const html = fs.readFileSync(htmlPath, "utf8");
    const match = html.match(/src="(.*?).(ts|tsx)"/);
    if (match && match[0]) {
      const subMatch = match[0].match(/src="(.*?)"/);
      if (subMatch && subMatch[1]) {
        const url = subMatch[1];
        const [src, entry] = url.split("/").filter(Boolean);
        conf.by = src;
        conf.entry = src + "/" + entry;
      }
    }
    conf["html-text"] = html.replace(/src="(.*?)"/, 'src="/index.js?bike=1"');
    brower();
  }

  if (conf["log-config"]) {
    delete (conf as any)["$0"];
    // delete (conf as any)["_"];
    const out: any = {};
    Object.keys(conf)
      .sort((a: any, b: any) => a - b)
      .forEach((k) => {
        // if (/-/.test(k) || k.length === 1) {
        //   return;
        // }
        out[k] = conf[k];
      });
    console.log(out);
    console.log(" ");
    console.log("Stop with only log config");
    process.exit();
  }

  return conf as any;
};
