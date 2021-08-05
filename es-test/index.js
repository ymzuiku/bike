var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// test/index.ts
__export(exports, {
  test: () => test
});

// test/so.ts
var import_fast_deep_equal = __toModule(require("fast-deep-equal"));

// test/cache.ts
var cache = {
  done: 0,
  each: null,
  before: null,
  it: {},
  matchIt: {},
  errors: {}
};

// test/log.ts
var import_chalk = __toModule(require("chalk"));
var cwd = process.cwd() + "/";
var cwdReg = new RegExp(cwd + ".*(.ts)");
var nodeModulesReg = new RegExp("node_modules");
var gray = (str) => import_chalk.default.gray(str);
var title = (str) => import_chalk.default.bold.white(str);
var green = (str) => import_chalk.default.green(str);
var greenBold = (str) => import_chalk.default.bold.green(str);
var red = (str) => import_chalk.default.bold.redBright(str);
function logFail(name, stack) {
  stack.split("\n").reverse().forEach((code) => {
    if (/Error: /.test(code)) {
      const [_, ...rest] = code.split("Error: ");
      code = rest.join("Error: ");
      console.log(red(code));
    }
    if (nodeModulesReg.test(code)) {
      return;
    }
    if (cwdReg.test(code)) {
      console.log(gray(`${code.split(cwd)[1]}`));
    }
  });
}

// test/so.ts
function createSo(name) {
  return {
    pick: (a, ...b) => {
      let isPick = false;
      b.forEach((v) => {
        if (a === b) {
          isPick = true;
        }
      });
      if (!isPick) {
        cache.errors[name] = new Error(`${a} isn't pick: ${b}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    reg: (a, regex) => {
      if (regex.test(a)) {
        return;
      }
      cache.errors[name] = new Error(`${a} isn't regexp: ${regex}`);
      logFail(name, cache.errors[name].stack);
    },
    notReg: (a, regex) => {
      if (!regex.test(a)) {
        return;
      }
      cache.errors[name] = new Error(`${a} is regexp: ${regex}`);
      logFail(name, cache.errors[name].stack);
    },
    notPick: (a, ...b) => {
      let isPick = false;
      b.forEach((v) => {
        if (a === b) {
          isPick = true;
        }
      });
      if (isPick) {
        cache.errors[name] = new Error(`${a} is pick: ${b}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    true: (a) => {
      if (!a) {
        cache.errors[name] = new Error(`${a} isn't true`);
        logFail(name, cache.errors[name].stack);
      }
    },
    false: (a) => {
      if (a) {
        cache.errors[name] = new Error(`${a} isn't false`);
        logFail(name, cache.errors[name].stack);
      }
    },
    equal: (a, b) => {
      if (a !== b) {
        cache.errors[name] = new Error(`${a} isn't equal ${b}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    notEqual: (a, b) => {
      if (a === b) {
        cache.errors[name] = new Error(`${a} is equal ${b}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    deepEqual: (a, b) => {
      if (!(0, import_fast_deep_equal.default)(a, b)) {
        cache.errors[name] = new Error(`${a} isn't deep equal ${b}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    notDeepEqual: (a, b) => {
      if ((0, import_fast_deep_equal.default)(a, b)) {
        cache.errors[name] = new Error(`${a} is deep equal ${b}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    unique: (list) => {
      const out = new Set(list);
      if (out.size !== list.length) {
        cache.errors[name] = new Error(`${list} isn't unique`);
        logFail(name, cache.errors[name].stack);
      }
    },
    error: (err, regex) => {
      if (!err) {
        cache.errors[name] = new Error(`${err} isn't error`);
        logFail(name, cache.errors[name].stack);
        return;
      }
      if (regex && !regex.test(err.message)) {
        cache.errors[name] = new Error(`error ${err} isn't regex ${regex}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    string: (target, has) => {
      if (!target) {
        cache.errors[name] = new Error(`error isn't Error`);
        logFail(name, cache.errors[name].stack);
        return;
      }
      if (!has && target || target.indexOf(has) > -1) {
        cache.errors[name] = new Error(`error ${target} isn't ${has}`);
        logFail(name, cache.errors[name].stack);
      }
    },
    fail: (msg) => {
      if (msg !== void 0 && msg !== "" && msg !== null) {
        cache.errors[name] = new Error(msg);
        logFail(name, cache.errors[name].stack);
      }
    }
  };
}
var _so = createSo("");

// test/event.ts
var import_fs_extra = __toModule(require("fs-extra"));
var import_path = __toModule(require("path"));
var cwd2 = process.cwd();
var cacheIgnoreTestPath = (0, import_path.resolve)(cwd2, "node_modules", ".bike.test.ignore");
var cacheTestPath = (0, import_path.resolve)(cwd2, "node_modules", ".bike.test.json");
function parse() {
  const obj = import_fs_extra.default.readJSONSync(cacheTestPath);
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
function saveFile(obj) {
  import_fs_extra.default.writeFileSync(cacheIgnoreTestPath, "ignore");
  import_fs_extra.default.writeJSONSync(cacheTestPath, obj, { spaces: 2 });
}
var event = {
  load: (it) => {
    if (!import_fs_extra.default.existsSync(cacheTestPath)) {
      const empty = { focus: [], fails: [], all: it, doing: [] };
      saveFile(empty);
      return it;
    }
    const { focus, fails, all, doing } = parse();
    if (all.length === 0) {
      saveFile({ focus, fails, all: it, doing });
    }
    if (focus.length) {
      const temp = [];
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
    if (fails.length) {
      return fails;
    }
    return it;
  },
  save: (doing, errors, all) => {
    const { focus, fails } = parse();
    if (errors.length > fails.length) {
      saveFile({ focus, fails: errors, all, doing });
      return;
    }
    const errorsSet = new Set(errors);
    const right = new Set(doing.filter((v) => !errorsSet.has(v)));
    const restFails = fails.filter((v) => !right.has(v));
    saveFile({ focus, fails: restFails, all, doing });
  }
};

// test/index.ts
var import_path2 = __toModule(require("path"));
require("source-map-support").install();
var conf = () => global.bikeConf;
var num = 0;
async function runOne(key) {
  num += 1;
  if (cache.each) {
    const fn = await Promise.resolve(cache.each(key, cache.it[key]));
    if (fn) {
      cache.it[key] = fn;
    }
  }
  if (!cache.it[key]) {
    console.error(red(`[${num}] ${key} is not match any test, you can try RegExp: /${key}/`));
    return;
  }
  console.log("	");
  console.log(title(`[${num}] ${key}:`));
  await Promise.resolve(cache.it[key]());
  cache.done += 1;
  if (cache.done === Object.keys(cache.matchIt).length) {
    console.log("	");
    const doing = Object.keys(cache.matchIt);
    const errors = Object.keys(cache.errors);
    const all = Object.keys(cache.it);
    if (!conf().all) {
      event.save(doing, errors, all);
    }
    if (errors.length === 0) {
      console.log(green(`PASS ALL, Done ${doing.length} case.`));
    } else {
      console.log(red(`== FAIL: ${errors.length}, PASS: ${doing.length - errors.length}, ALL: ${doing.length} ==`));
    }
    if (conf().reporter === "html") {
      console.log(`Coverage html at: ${(0, import_path2.resolve)(process.cwd(), "coverage")}/index.html`);
    }
    console.log("	");
  }
}
async function runTest() {
  let task = [];
  if (conf().focus) {
    const reg = new RegExp(conf().focus);
    Object.keys(cache.it).forEach((k) => {
      if (reg.test(k)) {
        task.push(k);
        console.log(gray("Focus task: " + k));
      }
    });
  } else {
    task = conf().all ? Object.keys(cache.it) : event.load(Object.keys(cache.it));
  }
  task.forEach((key) => {
    cache.matchIt[key] = cache.it[key];
  });
  if (cache.before) {
    await Promise.resolve(cache.before());
  }
  const errs = Object.keys(cache.matchIt);
  if (conf().watch) {
    console.log(gray(`Match case ${errs.length}. Please press key: ${greenBold("a")} test all case, ${greenBold("1~9")} focus number case, ${greenBold("q")} quit.`));
  }
  errs.forEach(runOne);
}
var test = {
  each: (fn) => {
    if (cache.each) {
      throw new Error("[bike] test.each can only be set once");
    }
    cache.each = fn;
  },
  before: (fn) => {
    if (cache.before) {
      throw new Error("[bike] test.before can only be set once");
    }
    cache.before = fn;
  },
  it: (name, fn) => {
    if (cache.it[name]) {
      throw new Error(`Error: ${name} is defined test.it, keep test name is unique.`);
    }
    const so = createSo(name);
    cache.it[name] = async () => {
      await Promise.resolve(fn(so));
    };
  }
};
setTimeout(runTest, 30);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  test
});
//# sourceMappingURL=index.js.map
