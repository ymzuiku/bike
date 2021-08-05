/* c8 ignore start */
import fs from "fs-extra";
import { resolve } from "path";
const cwd = process.cwd();
const cacheIgnoreTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, "node_modules", ".bike.test.json");

interface CacheObj {
  focus: string[];
  fails: string[];
  all: string[];
  doing: string[];
}

function parse(): CacheObj {
  const obj = fs.readJSONSync(cacheTestPath);
  if (!obj.focus) {
    obj.focus = [];
  }
  if (!obj.fails) {
    obj.fails = [];
  }
  if (!obj.all) {
    obj.all = [];
  }
  if (!obj.doing) {
    obj.doing = [];
  }
  return obj;
}

function saveFile(obj: CacheObj) {
  fs.writeFileSync(cacheIgnoreTestPath, "ignore");
  fs.writeJSONSync(cacheTestPath, obj, { spaces: 2 });
}

export const event = {
  // 读取文件,并且返回这次需要执行的任务
  load: (it: string[]) => {
    if (!fs.existsSync(cacheTestPath)) {
      const empty = { focus: [], fails: [], all: it, doing: [] };
      saveFile(empty);
      return it;
    }
    const { focus, fails, all, doing } = parse();
    if (all.length === 0) {
      saveFile({ focus, fails, all: it, doing });
    }
    // 若有需要匹配的，返回匹配内容
    if (focus.length) {
      const temp: string[] = [];
      focus.forEach((str) => {
        if (str[0] === "/" && str[str.length - 1] === "/") {
          const reg = new RegExp(str);
          it.forEach((name) => {
            if (reg.test(name)) {
              temp.push(name);
            }
          });
        } else {
          temp.push(str);
        }
      });

      return temp;
    }
    // 如有上次错误的，以上次错误为准
    if (fails.length) {
      return fails;
    }
    // 若没有匹配的，返回所有
    return it;
  },
  save: (doing: string[], errors: string[], all: string[]) => {
    const { focus, fails } = parse();
    // 若这次错误大于上次错误，使用这次错误记录
    if (errors.length > fails.length) {
      saveFile({ focus, fails: errors, all, doing });
      return;
    }

    // 计算出成功的用例
    const errorsSet = new Set(errors);
    const right = new Set(doing.filter((v) => !errorsSet.has(v)));

    // 从lastFails中抹去这次成功的
    const restFails = fails.filter((v: string) => !right.has(v));
    saveFile({ focus, fails: restFails, all, doing });
  },
};
