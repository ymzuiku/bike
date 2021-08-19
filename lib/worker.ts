/* c8 ignore start */
import cluster from "cluster";
import { resolve } from "path";
import type { Conf } from "./getConfig";
// import c8 from "c8";
// import { cover } from "./cover";

function getMsg(msg: string) {
  if (!/^bike::/.test(msg)) {
    return;
  }
  return msg.replace("bike::", "");
}

export const workerFork = (conf: Conf) => {
  for (const id in cluster.workers) {
    (cluster as any).workers[id].process.kill();
  }
  const worker = cluster.fork();
  worker.send("bike::" + JSON.stringify(conf));
  if (conf.afterFork) {
    conf.afterFork(conf, worker);
  }
};

export const workerStart = () => {
  if (cluster.isWorker) {
    process.on("message", (msg) => {
      msg = getMsg(msg);
      if (!msg) {
        return;
      }
      const conf = JSON.parse(msg) as Conf;
      // 监听Promise没有被捕获的失败函数
      process.on("unhandledRejection", function (err, promise) {
        console.error("[bike]", err);
      });
      // console.log("bbbbbbbbbbbbbbbb");
      // cover(conf);
      try {
        if (/\.mjs/.test(conf.outfile)) {
          import(resolve(process.cwd(), conf.out + "/" + conf.outfile));
        } else {
          require(resolve(process.cwd(), conf.out + "/" + conf.outfile));
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  return cluster.isWorker;
};
