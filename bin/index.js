require("source-map-support").install();
const esbuild = require("esbuild");
const { resolve } = require("path");
const { getExternals } = require("./getExternals");
const getConfig = require("./getConfig");
const child = require("./child");
const { copyPackage } = require("./copyPackage");
const { workerFork, workerStart } = require("./worker");

const fs = require("fs-extra");
const cwd = process.cwd();
const ignoreChangeTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, ".bike.test.yaml");

async function bike(conf) {
  if (workerStart(conf)) {
    return;
  }
  if (!fs.existsSync(resolve(cwd, conf.out))) {
    fs.mkdirSync(resolve(cwd, conf.out));
  }

  const copyFiles = new Set([".env", ...(conf.copy || [])]);
  copyFiles.forEach((file) => {
    const p = resolve(cwd, file);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, resolve(cwd, conf.out, file));
    }
  });

  copyPackage(conf);

  let external = undefined;
  if (conf.bundle) {
    if (conf.external) {
      external = [...getExternals(conf), ...conf.external];
    } else {
      external = getExternals(conf);
    }
  }

  const esbuildOptions = {
    entryPoints: [resolve(cwd, conf.entry)],
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

  console.log(esbuildOptions);

  const publicPath = resolve(cwd, conf.public);
  if (fs.existsSync(publicPath)) {
    fs.copySync(publicPath, resolve(cwd, conf.out));
  }

  const fork = () => {
    if (conf.spawn) {
      child(conf);
      return;
    }
    workerFork(conf);
  };

  const build = async () => {
    if ((conf.watch || conf.start) && conf.clear) {
      console.clear();
    }
    if (conf.before) {
      await Promise.resolve(conf.before(conf));
    }
    await esbuild.build({ ...esbuildOptions });
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
    require(resolve(cwd, conf.out + "/" + conf.outfile));
  } else if (conf.watch) {
    fork();
    let lock = false;
    fs.watch(conf.src, { recursive: true }, async (e, f) => {
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
        fs.writeFileSync(cacheTestPath, "");
      }
      fs.watch(cacheTestPath, async (e, f) => {
        if (fs.existsSync(ignoreChangeTestPath)) {
          fs.rmSync(ignoreChangeTestPath);
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

module.exports = {
  bike,
  getConfig,
};
