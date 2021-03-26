const cluster = require("cluster");
const fs = require("fs");

function autoReload(onStart, onReload, dir) {
  if (cluster.isWorker) {
    // 监听Promise没有被捕获的失败函数
    process.on("unhandledRejection", function (err, promise) {
      console.error("[dev-start]", err);
    });
    try {
      onStart();
    } catch (error) {
      console.error(error);
    }
    return;
  }
  const fork = () => {
    for (const id in cluster.workers) {
      cluster.workers[id].process.kill();
    }
    if (onReload) {
      onReload();
    }
    cluster.fork();
    // if (isAutoForkOnExit) {
    //   cluster.on("exit", (worker, code, signal) => {
    //     cluster.fork();
    //   });
    // }
  };

  fork();
  fs.watch(dir, { recursive: true }, (e, f) => {
    fork();
  });
}

module.exports = { autoReload };
