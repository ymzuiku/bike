import fs from "fs-extra";
import { resolve } from "path";
import yaml from "yaml";
const cwd = process.cwd();
const ignoreChangeTestPath = resolve(cwd, "node_modules", ".bike.test.ignore");
const cacheTestPath = resolve(cwd, ".bike.test.yaml");

function parse() {
  const file2 = fs.readFileSync(cacheTestPath, "utf8");
  const obj = yaml.parse(file2) || {};
  return [obj.FOCUS || [], obj.FAILS || [], obj.ALL || []];
}

function saveFile(focus: string[], fails: string[], all: string[]) {
  fs.writeFileSync(ignoreChangeTestPath, "ignore");
  fs.writeFileSync(
    cacheTestPath,
    `# Local test result, please add this file in .gitignore
${focus.length ? yaml.stringify({ FOCUS: focus }) : "FOCUS:\n"}
${fails.length ? yaml.stringify({ FAILS: fails }) : "FAILS:\n"}
${all.length ? yaml.stringify({ ALL: all }) : "ALL:\n"}`
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
