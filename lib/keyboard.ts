/* c8 ignore start */
import readline from "readline";
import cluster from "cluster";
import chalk from "chalk";
import { resolve } from "path";
import type { Conf } from "./getConfig";
import fs from "fs-extra";

const cwd = process.cwd();

export const cacheIgnoreTestPath = resolve(
  cwd,
  "node_modules",
  ".bike.test.ignore"
);
export const cacheTestPath = resolve(cwd, "node_modules", ".bike.test.json");

function parse() {
  return fs.readJSONSync(cacheTestPath);
}

export interface Cache {
  focus: string[];
  fails: string[];
  all: string[];
  doing: string[];
}

function saveFile(obj: Cache) {
  fs.writeJSONSync(cacheTestPath, obj, { spaces: 2 });
}

export const event = {
  // 焦距某一个测试
  focus: (num: number) => {
    const { all, doing } = parse();
    if (!doing[num]) {
      console.log(
        chalk.gray(
          `[bite] No have number ${
            num + 1
          } in last case, Please press key ${chalk.green("a")} reload all.`
        )
      );
      return;
    }
    saveFile({ focus: [doing[num]], fails: [], all, doing });
  },
  // 全部重新测试
  all: () => {
    const obj = parse();
    obj.focus = [];
    obj.fails = [];
    saveFile(obj);
  },
};

const nums: { [key: string]: number } = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "0": 10,
};

export const keyboard = (conf: Conf, reload: Function) => {
  if (cluster.isWorker) {
    return;
  }
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on("keypress", (_, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    } else if (key.name === "q") {
      process.exit();
    } else if (key.name === "a") {
      event.all();
      reload();
    } else if (nums[key.name]) {
      event.focus(nums[key.name] - 1);
      reload();
    }
  });
};
