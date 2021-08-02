import fs from "fs-extra";
import { resolve } from "path";
const cwd = process.cwd();
const ignoreChangeTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, ".bike.test.config");

const FOCUS = "------ FOCUS ------";
const LAST = "------ FAILS ------";
const ALL = "------  ALL  ------";

function parse() {
  const file = fs.readFileSync(cacheTestPath).toString();
  if (file === "") {
    saveFile([], [], []);
    return [[], [], []];
  }
  const [top, all] = file.split(ALL);
  const [focus, last] = top.replace(FOCUS, "").split(LAST);

  // 若匹配成功focus，返回focus的itNames
  const focusNames = focus
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

  // 若匹配成功lastFails，返回fails的itNames
  const failsNames = last
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

  const allNames = all
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

  return [focusNames, failsNames, allNames];
}

function saveFile(focusList: string[], lastList: string[], allList: string[]) {
  fs.writeFileSync(ignoreChangeTestPath, "ignore");
  fs.writeFileSync(
    cacheTestPath,
    `${FOCUS}
${focusList.join("\n")}

${LAST}
${lastList.join("\n")}

${ALL}
${allList.join("\n")}

    `
  );
}

export const local = {
  // 读取文件,并且返回这次需要执行的任务
  load: (it: string[]) => {
    if (!fs.existsSync(cacheTestPath)) {
      saveFile([], [], []);
      return [[], [], []];
    }
    const [focusNames, failNames, allNames] = parse();
    if (allNames.length === 0) {
      saveFile(focusNames, failNames, it);
    }
    // 若有需要匹配的，返回匹配内容
    if (focusNames.length) {
      const focus = [];
      focusNames.forEach((str) => {
        if (str[0] === "/" && str[str.length - 1] === "/") {
          const reg = new RegExp(str);
          it.forEach((name) => {
            if (reg.test(name)) {
              focus.push(name);
            }
          });
        } else {
          focus.push(str);
        }
      });

      return focus;
    }
    // 如有上次错误的，以上次错误为准
    if (failNames.length) {
      return failNames;
    }
    // 若没有匹配的，返回所有
    return it;
  },
  save: (doing: string[], errors: string[]) => {
    const [focusNames, failNames, it] = parse();
    // 若这次错误大于上次错误，使用这次错误记录
    if (errors.length > failNames.length) {
      saveFile(focusNames, errors, it);
      return;
    }

    // 计算出成功的用例，从lastFails中抹去
    // const right = new Set();
    const errorsSet = new Set(errors);
    const right = new Set(doing.filter((v) => !errorsSet.has(v)));

    const restFails = failNames.filter((v) => !right.has(v));
    saveFile(focusNames, restFails, it);
  },
};
