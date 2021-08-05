import esbuild from "esbuild";
import { resolve } from "path";
import { getExternals } from "./getExternals";
import type { Conf } from "./getConfig";
import { spawn } from "./spawn";
import { copyPackage } from "./copyPackage";
import { workerFork, workerStart } from "./worker";
import { keyboard, cacheTestPath, cacheIgnoreTestPath } from "./keyboard";
import { serve, onBuilded, releaseBrowser } from "./serve";
import fs from "fs-extra";
import { baseConfig } from "./baseConfig";
import { watch } from "./watch";

const cwd = process.cwd();

export async function bike(config: Partial<Conf>) {
  const conf = baseConfig(config);
  if (workerStart()) {
    return;
  }
  if (!fs.existsSync(resolve(cwd, conf.out!))) {
    fs.mkdirSync(resolve(cwd, conf.out!));
  }

  const copyFiles = new Set(
    [conf.browser && ".env", ...((conf.copy as string[]) || [])].filter(
      Boolean
    ) as string[]
  );
  copyFiles.forEach((file) => {
    const p = resolve(cwd, file);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, resolve(cwd, conf.out!, file));
    }
  });

  copyPackage(conf);

  const staticPath = resolve(cwd, conf.static);
  if (fs.existsSync(staticPath)) {
    fs.copySync(staticPath, resolve(cwd, conf.out!));
  }

  if (conf.browser) {
    const htmlPath = resolve(cwd, conf.out!, "index.html");
    fs.writeFileSync(htmlPath, conf["html-text"]);
  }

  if (conf.browser) {
    serve(conf);
  }
  const fork = () => {
    if (conf.browser) {
      return onBuilded(conf);
    }
    if (conf.spawn) {
      return spawn(conf);
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
    external,
    outdir: conf.splitting ? conf.out : undefined,
    outfile: conf.splitting ? undefined : conf.out + "/" + conf.outfile,
    sourcemap: conf.sourcemap,
  };

  const build = async () => {
    if (!conf.browser && (conf.watch || conf.start) && conf.clear) {
      console.clear();
    }
    if (conf.before) {
      await Promise.resolve(conf.before(conf));
    }
    await esbuild.build(esbuildOptions);

    if (conf.after) {
      conf.after(conf);
    }

    if (!conf.watch && !conf.start) {
      if (conf.browser) {
        releaseBrowser(conf);
      }
      console.log("release done.");
    }
  };

  try {
    await build();
  } catch (err) {
    throw err;
  }

  if (conf.start) {
    fork();
  } else if (conf.watch) {
    fork();
    const reload = async () => {
      await build();
      fork();
    };
    watch(conf.source, reload);
    if (conf.test) {
      keyboard(conf, reload);
    }
  }
}
