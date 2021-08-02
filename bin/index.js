require("source-map-support").install();
const esbuild = require("esbuild");
const { resolve } = require("path");
const { getExternals } = require("./getExternals");
const { getCopyFiles } = require("./getCopyFiles");
const getConfig = require("./getConfig");

const fs = require("fs-extra");
const cwd = process.cwd();
const cluster = require("cluster");
const { default: c8 } = require("./c8");
const ignoreChangeTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, ".bike.test.yaml");

function getMsg(msg) {
  if (!/^bike::/.test(msg)) {
    return;
  }
  return msg.replace("bike::", "");
}

// const { getPkg } = require("./getPkg");

async function bike(config) {
  if (cluster.isWorker) {
    process.on("message", (msg) => {
      msg = getMsg(msg);
      if (!msg) {
        return;
      }
      const conf = JSON.parse(msg);
      // 监听Promise没有被捕获的失败函数
      process.on("unhandledRejection", function (err, promise) {
        console.error("[bike]", err);
      });
      try {
        require(resolve(process.cwd(), conf.out + "/index.js"));
      } catch (error) {
        console.error(error);
      }
    });
    return;
  }
  if (!fs.existsSync(resolve(cwd, config.out))) {
    fs.mkdirSync(resolve(cwd, config.out));
  }

  getCopyFiles(config).forEach((file) => {
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

  const fork = () => {
    for (const id in cluster.workers) {
      cluster.workers[id].process.kill();
    }
    const worker = cluster.fork();
    worker.send("bike::" + JSON.stringify(config));
    if (config.afterFork) {
      config.afterFork(config, worker);
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
