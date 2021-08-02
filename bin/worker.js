const cluster = require("cluster");
const { resolve } = require("path");

function getMsg(msg) {
  if (!/^bike::/.test(msg)) {
    return;
  }
  return msg.replace("bike::", "");
}

const workerFork = (config) => {
  for (const id in cluster.workers) {
    cluster.workers[id].process.kill();
  }
  const worker = cluster.fork();
  worker.send("bike::" + JSON.stringify(config));
  if (config.afterFork) {
    config.afterFork(config, worker);
  }
};

const workerStart = () => {
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
  }
  return cluster.isWorker;
};

module.exports = {
  workerFork,
  workerStart,
};
