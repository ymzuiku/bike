const readline = require("readline");
const cluster = require("cluster");
const { resolve } = require("path");
const fs = require("fs-extra");

const cwd = process.cwd();
const cacheIgnoreTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, ".bike.test.json");

function parse() {
  return fs.readJSONSync(cacheTestPath);
}

function saveFile(obj) {
  // fs.writeFileSync(cacheIgnoreTestPath, "ignore");
  fs.writeJSONSync(cacheTestPath, obj, { spaces: 2 });
}

const event = {
  // 焦距某一个测试
  focus: (num) => {
    const { all, doing } = parse();
    if (!doing[num]) {
      console.log("[bite] No have number 2 in last case");
    }
    saveFile({ focus: [doing[num]], fails: [], all, doing });
  },
  // 取消焦距某个测试
  cancelFocus: () => {
    const obj = parse();
    obj.focus = [];
    saveFile(obj);
  },
  // 全部重新测试
  all: () => {
    const obj = parse();
    obj.focus = [];
    obj.fails = [];
    saveFile(obj);
  },
};

const nums = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  0: 10,
};

const keyboard = (conf) => {
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
    } else if (key.name === "f") {
      event.cancelFocus();
    } else if (nums[key.name]) {
      event.focus(nums[key.name]);
    }
  });
};

module.exports = { keyboard, cacheIgnoreTestPath, cacheTestPath };
