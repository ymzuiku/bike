/* c8 ignore start */
import chokidar from "chokidar";
import fs from "fs-extra";
import os from "os";

export const watch = (uri: string, event: Function, timeout = 65) => {
  let lock = false;
  const fn = async () => {
    if (lock) {
      return;
    }
    lock = true;
    await Promise.resolve(event());
    setTimeout(() => {
      lock = false;
    }, timeout);
  };

  if (/(darwin|window)/.test(os.type().toLowerCase())) {
    if (fs.statSync(uri).isDirectory()) {
      fs.watch(uri, { recursive: true }, fn);
    } else {
      fs.watchFile(uri, fn);
    }
  } else {
    chokidar.watch(uri).on("all", fn);
  }
};
