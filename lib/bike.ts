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
    fs.removeSync(resolve(cwd, conf["html-out"]!));
    if (!fs.existsSync(resolve(cwd, conf["html-out"]!))) {
      fs.mkdirpSync(resolve(cwd, conf["html-out"]!));
    }
    const publicPath = resolve(cwd, conf.public);
    if (fs.existsSync(publicPath)) {
      fs.copySync(publicPath, resolve(cwd, conf["html-out"]!));
    }
    const htmlPath = resolve(cwd, conf["html-out"]!, "index.html");
    fs.writeFileSync(htmlPath, conf["html-text"]);
    if (conf.isWatch) {
      devServe(conf);
    }
  }

  if (conf.source) {
    fs.removeSync(resolve(cwd, conf.out!));
    if (!fs.existsSync(resolve(cwd, conf.out!))) {
      fs.mkdirpSync(resolve(cwd, conf.out!));
    }

    if (!conf.browser) {
      const copyFiles = new Set(
        [".env", ...((conf.copy as string[]) || [])].filter(
          Boolean,
        ) as string[],
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
    if (conf.browser) {
      esbuildOptions = {
        entryPoints: [resolve(cwd, conf["entry"]!)],
        bundle: true,
        target: ["es6"],
        // target: ["chrome58", "firefox57", "safari11", "edge16"],
        minify: !conf.isWatch,
        platform: "neutral",
        splitting: conf.splitting,
        format: conf.format || "cjs",
        outdir: conf["out"],
        sourcemap: !conf.isWatch,
      };
    } else {
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
  }

  if (conf.html) {
    esbuildHTMLOptions = {
      entryPoints: [resolve(cwd, conf["html-entry"]!)],
      bundle: true,
      target: ["es6"],
      // target: ["chrome58", "firefox57", "safari11", "edge16"],
      minify: !conf.isWatch,
      platform: "neutral",
      splitting: true,
      format: conf.format || "esm",
      outdir: conf["html-out"],
      sourcemap: !conf.isWatch,
    };
  }

  const build = async () => {
    // if ((conf.isWatch || conf.start) && conf.clear) {
    //   console.clear();
    // }
    if (conf.test) {
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

    if (!conf.isWatch && !conf.start) {
      console.log("release server done.");
    }
  };

  const buildHTML = async () => {
    await esbuild.build(esbuildHTMLOptions);

    if (!conf.isWatch && !conf.start) {
      releaseBrowser(conf);
      console.log("release html done.");
    }
  };

  const reload = () => {
    if (conf.source) {
      if (conf.spawn) {
        return spawn(conf);
      }
      workerFork(conf);
    }
  };

  const reloadHTML = () => {
    if (conf.html) {
      onBuilded(conf);
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
    reloadHTML();
  } else if (conf.isWatch) {
    reload();
    reloadHTML();
    const onWatch = async () => {
      await build();
      reload();
    };
    if (conf.source) {
      conf.source.split(",").forEach((src) => {
        watch(src, onWatch);
      });
    }
    if (Array.isArray(conf.watch)) {
      conf.watch.forEach((src) => {
        if (typeof src == "string") {
          watch(src, onWatch);
        }
      });
    }

    if (conf.html) {
      watch(conf["html-source"], async () => {
        await buildHTML();
        reloadHTML();
      });
    }
    if (conf.test) {
      keyboard(conf, onWatch);
    }
  }
}
