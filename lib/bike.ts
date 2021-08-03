// require("source-map-support").install();
import sourceMapSupport from "source-map-support";
import esbuild from "esbuild";
import { resolve } from "path";
import { getExternals } from "./getExternals";
import type { Conf } from "./getConfig";
import { child } from "./child";
import { copyPackage } from "./copyPackage";
import { workerFork, workerStart } from "./worker";
import { keyboard, cacheTestPath, cacheIgnoreTestPath } from "./keyboard";

sourceMapSupport.install();

const fs = require("fs-extra");
const cwd = process.cwd();

export async function bike(conf: Conf) {
  if (workerStart()) {
    return;
  }
  if (conf.test && conf.watch) {
    keyboard(conf);
  }
  if (!fs.existsSync(resolve(cwd, conf.out!))) {
    fs.mkdirSync(resolve(cwd, conf.out!));
  }

  const copyFiles = new Set([".env", ...((conf.copy as string[]) || [])]);
  copyFiles.forEach((file) => {
    const p = resolve(cwd, file);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, resolve(cwd, conf.out!, file));
    }
  });

  copyPackage(conf);

  const publicPath = resolve(cwd, conf.public);
  if (fs.existsSync(publicPath)) {
    fs.copySync(publicPath, resolve(cwd, conf.out!));
  }

  const fork = () => {
    if (conf.spawn) {
      child(conf);
      return;
    }
    workerFork(conf);
  };

  let external = undefined;
  if (conf.bundle) {
    if (conf.external) {
      external = [...getExternals(conf), ...conf.external];
    } else {
      external = getExternals(conf);
    }
  }

  const esbuildOptions: any = {
    entryPoints: [resolve(cwd, conf.entry!)],
    bundle: conf.bundle,
    target: conf.target || ["node16", "es6"],
    minify: conf.minify,
    define: conf.define,
    platform: conf.platform,
    splitting: conf.splitting,
    format: conf.format,
    jsxFactory: conf["jsx-factory"],
    jsxFragment: conf["jsx-fragment"],
    external,
    outdir: conf.splitting ? conf.out : undefined,
    outfile: conf.splitting ? undefined : conf.out + "/" + conf.outfile,
    sourcemap: conf.sourcemap,
  };

  const build = async () => {
    if ((conf.watch || conf.start) && conf.clear) {
      console.clear();
    }
    if (conf.before) {
      await Promise.resolve(conf.before(conf));
    }
    await esbuild.build(esbuildOptions);
    if (conf.after) {
      conf.after(conf);
    }
  };

  try {
    await build();
  } catch (err) {
    throw err;
  }

  if (conf.start) {
    // require(resolve(cwd, conf.out + "/" + conf.outfile));
    fork();
  } else if (conf.watch) {
    fork();
    let lock = false;
    fs.watch(conf.src, { recursive: true }, async () => {
      if (lock) {
        return;
      }
      lock = true;
      await build();
      fork();
      setTimeout(() => {
        lock = false;
      }, 65);
    });

    // 若不是测试所有，监听测试配置文件的修改
    if (!conf.all) {
      if (!fs.existsSync(cacheTestPath)) {
        fs.writeFileSync(cacheTestPath, "{}");
      }
      fs.watch(cacheTestPath, async () => {
        if (fs.existsSync(cacheIgnoreTestPath)) {
          fs.rmSync(cacheIgnoreTestPath);
          return;
        }
        if (lock) {
          return;
        }
        lock = true;
        await build();
        fork();
        setTimeout(() => {
          lock = false;
        }, 65);
      });
    }
  }
}
