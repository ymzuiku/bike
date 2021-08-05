var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// log/index.ts
__export(exports, {
  log: () => log,
  stack: () => stack
});
var cwd = process.cwd() + "/";
var cwdReg = new RegExp(cwd + ".*(.ts)");
function log(...args) {
  const err = new Error("");
  let line = "";
  err.stack.split("\n").reverse().forEach((code) => {
    if (cwdReg.test(code)) {
      line = code.split(cwd)[1].replace(/(\(|\))/g, "");
    }
  });
  console.log(line);
  console.log(...args);
}
function stack(...args) {
  const err = new Error("");
  const logs = [];
  err.stack.split("\n").reverse().forEach((code) => {
    if (cwdReg.test(code)) {
      logs.push(code.split(cwd)[1].replace(/(\(|\))/g, ""));
    }
  });
  logs.forEach((v, i) => {
    console.log(v);
  });
  console.log(...args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  log,
  stack
});
//# sourceMappingURL=index.js.map
