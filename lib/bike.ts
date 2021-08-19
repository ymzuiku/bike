/* c8 ignore start */
import esbuild from "esbuild";
import { resolve } from "path";
import { getExternals } from "./getExternals";
import type { Conf } from "./getConfig";
import { spawn } from "./spawn";
import { copyPackage } from "./copyPackage";
import { workerFork, workerStart } from "./worker";
import { keyboard } from "./keyboard";
import { devServe, onBuilded, releaseBrowser } from "./devServe";
import fs from "fs-extra";
import { baseConfig } from "./baseConfig";
import { watch } from "./watch";

const cwd = process.cwd();

export async function bike(config: Partial<Conf>) {
  const conf = baseConfig(config);

  if (workerStart()) {
    return;
  }

  if (conf.html) {
    if (!fs.existsSync(resolve(cwd, conf["html-out"]!))) {
      fs.mkdirpSync(resolve(cwd, conf["html-out"]!));
    }
    const htmlPath = resolve(cwd, conf["html-out"]!, "index.html");
    fs.writeFileSync(htmlPath, conf["html-text"]);
    if (conf.watch) {
      devServe(conf);
    }
  }

  if (conf.source) {
    if (!fs.existsSync(resolve(cwd, conf.out!))) {
      fs.mkdirpSync(resolve(cwd, conf.out!));
    }

    const copyFiles = new Set(
      [".env", ...((conf.copy as string[]) || [])].filter(Boolean) as string[]
    );
    copyFiles.forEach((file) => {
      const p = resolve(cwd, file);
      if (fs.existsSync(p)) {
        fs.copyFileSync(p, resolve(cwd, conf.out!, file));
      }
    });
    const staticPath = resolve(cwd, conf.static);
    if (fs.existsSync(staticPath)) {
      fs.copySync(staticPath, resolve(cwd, conf.out!));
    }
    copyPackage(conf);
  }

  let external = undefined;
  if (conf.bundle) {
    if (conf.external) {
      external = [...getExternals(conf), ...conf.external];
    } else {
      external = getExternals(conf);
    }
  }

  let esbuildOptions: any;
  let esbuildHTMLOptions: any;

  if (conf.source) {
    esbuildOptions = {
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
  }

  if (conf.html) {
    esbuildHTMLOptions = {
      entryPoints: [resolve(cwd, conf["html-entry"]!)],
      bundle: conf.bundle,
      // --target=chrome58,firefox57,safari11,edge16
      target: ["chrome58", "firefox57", "safari11", "edge16"],
      minify: conf.minify,
      define: conf.define,
      // platform: conf.platform,
      splitting: conf.splitting,
      format: conf.format,
      external,
      outdir: conf.splitting ? conf["html-out"] : undefined,
      outfile: conf.splitting
        ? undefined
        : conf["html-out"] + "/" + conf.outfile,
      sourcemap: conf.sourcemap,
    };
  }

  const build = async () => {
    if ((conf.watch || conf.start) && conf.clear) {
      console.clear();
    }
    if (conf.before) {
      await Promise.resolve(conf.before(conf));
    }
    if (conf.source) {
      await esbuild.build(esbuildOptions);
    }

    if (conf.after) {
      conf.after(conf);
    }

    if (!conf.watch && !conf.start) {
      console.log("release server done.");
    }
  };

  const buildHTML = async () => {
    await esbuild.build(esbuildHTMLOptions);

    if (!conf.watch && !conf.start) {
      releaseBrowser(conf);
      console.log("release html done.");
    }
  };

  const reload = () => {
    if (conf.html) {
      onBuilded(conf);
    }
    if (conf.source) {
      if (conf.spawn) {
        return spawn(conf);
      }
      workerFork(conf);
    }
  };

  try {
    if (conf.source) {
      await build();
    }
    if (conf.html) {
      await buildHTML();
    }
  } catch (err) {
    throw err;
  }

  if (conf.start) {
    reload();
  } else if (conf.watch) {
    reload();
    const onWatch = async () => {
      await build();
      reload();
    };
    if (conf.source) {
      conf.source.split(",").forEach((src) => {
        watch(src, onWatch);
      });
    }

    if (conf.html) {
      watch(conf["html-source"], async () => {
        await buildHTML();
        reload();
      });
    }
    if (conf.test) {
      keyboard(conf, onWatch);
    }
  }
}
