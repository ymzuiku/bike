require("source-map-support").install();
const esbuild = require("esbuild");
const { resolve } = require("path");
const { getExternals } = require("./getExternals");
const getConfig = require("./getConfig");
const child = require("./child");
const { workerFork, workerStart } = require("./worker");

const fs = require("fs-extra");
const cwd = process.cwd();
const ignoreChangeTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, ".bike.test.yaml");

async function bike(config) {
  if (workerStart(config)) {
    return;
  }
  if (!fs.existsSync(resolve(cwd, config.out))) {
    fs.mkdirSync(resolve(cwd, config.out));
  }

  const copyFiles = new Set([".env", ...(config.copy || [])]);
  copyFiles.forEach((file) => {
    const p = resolve(cwd, file);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, resolve(cwd, config.out, file));
    }
  });

  const esbuildOptions = {
    entryPoints: [resolve(cwd, config.entry)],
    bundle: true,
    target: config.target || ["node16", "es6"],
    minify: config.minify,
    define: config.define,
    platform: config.platform,
    splitting: config.splitting,
    format: config.format,
    jsxFactory: config["jsx-factory"],
    jsxFragment: config["jsx-fragment"],
    external: config.external
      ? [...getExternals(config), ...config.external]
      : getExternals(config),
    outfile: config.out + "/index.js",
    sourcemap: config.sourcemap,
  };

  const publicPath = resolve(cwd, config.public);
  if (fs.existsSync(publicPath)) {
    fs.copySync(publicPath, resolve(cwd, config.out));
  }

  const fork = () => {
    if (config.spawn) {
      child(config);
      return;
    }
    workerFork(config);
  };

  const build = async () => {
    if ((config.watch || config.start) && config.clear) {
      console.clear();
    }
    if (config.before) {
      await Promise.resolve(config.before(config));
    }
    await esbuild.build({ ...esbuildOptions });
    if (config.after) {
      config.after(config);
    }
  };

  try {
    await build();
  } catch (err) {
    throw err;
  }

  if (config.start) {
    require(resolve(cwd, config.out + "/index.js"));
  } else if (config.watch) {
    fork();
    let lock = false;
    fs.watch(config.src, { recursive: true }, async (e, f) => {
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
    if (!config.all) {
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
