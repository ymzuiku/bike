const esbuild = require("esbuild");
const { resolve } = require("path");
const { getExternals } = require("./getExternals");
const { copyFiles } = require("./copyFiles");
const loadArgs = require("./loadArgs");

const fs = require("fs-extra");
const cwd = process.cwd();
const cluster = require("cluster");
const { getPkg } = require("./getPkg");

const baseConfig = {
  out: "",
  staticDir: "",
  entry: "",
  isWatch: false,
  src: "",
  clear: true,
  before: () => {},
  after: (worker) => {},
};

async function bike(config = baseConfig) {
  if (cluster.isWorker) {
    process.on("message", (msg) => {
      const conf = JSON.parse(msg);
      // 监听Promise没有被捕获的失败函数
      process.on("unhandledRejection", function (err, promise) {
        console.error("[bike]", err);
      });
      try {
        require(resolve(cwd, conf.out + "/index.js"));
      } catch (error) {
        console.error(error);
      }
    });
    return;
  }

  if (!fs.existsSync(resolve(cwd, config.out))) {
    fs.mkdirSync(resolve(cwd, config.out));
  }

  copyFiles().forEach((file) => {
    const p = resolve(cwd, file);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, resolve(cwd, config.out, file));
    }
  });

  const pkg = getPkg();
  if (pkg) {
    const _pkg = JSON.parse(JSON.stringify(pkg));
    delete _pkg.devDependencies;
    if (!config.isWatch) {
      delete _pkg.dependencies;
    }
    fs.writeFileSync(
      resolve(cwd, config.out, "package.json"),
      JSON.stringify(_pkg, null, 2)
    );
  }

  const ops = {
    entryPoints: [resolve(cwd, config.entry)],
    bundle: true,
    target: ["node16", "es6"],
    platform: "node",
    external: getExternals(config.isWatch),
    outfile: config.out + "/index.js",
    sourcemap: config.sourcemap,
  };

  const publicPath = resolve(cwd, config.staticDir);
  if (fs.existsSync(publicPath)) {
    fs.copySync(publicPath, resolve(cwd, config.out));
  }

  const build = async () => {
    if (config.clear) {
      console.clear();
    }
    if (config.before) {
      await config.before();
    }
    esbuild.buildSync(ops);
  };

  const fork = () => {
    for (const id in cluster.workers) {
      cluster.workers[id].process.kill();
    }
    const worker = cluster.fork();
    worker.send(JSON.stringify(config));
    if (config.after) {
      config.after(worker);
    }
  };

  await build();

  let lock = false;

  if (config.isWatch) {
    fork();
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
  }
}

module.exports = {
  bike,
  loadArgs,
};
