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
    conf.entry = conf.src + "/index.ts";
  }

  if (conf.sourcemap === undefined) {
    if (conf.watch || conf.start || conf.reporter) {
      conf.sourcemap = true;
    }
  }

  const brower = () => {
    conf.platform = "neutral";
    if (!conf.watch && !conf.start) {
      if (conf.depend === undefined) {
        conf.depend = true;
      }
      if (conf.minify === undefined) {
        conf.minify = true;
      }
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
        conf.src = src;
        conf.entry = src + "/" + entry;
      }
    }
    conf["html-text"] = html.replace(/src="(.*?)"/, 'src="/index.js?bike=1"');
    brower();
  }
  return conf as any;
};
