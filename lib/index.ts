import { createSo, So } from "./so";
import { cache } from "./cache";
import { gray, green, logPass, red } from "./log";
import { local } from "./local";

const testAll = () => (global as any).bikeTestAll;

async function runOne(key: string) {
  if (cache.each) {
    const fn = await Promise.resolve(cache.each(key, cache.it[key]));
    if (fn) {
      cache.it[key] = fn;
    }
  }
  if (!cache.it[key]) {
    console.error(
      red(`[FOCUS] ${key} is not match any test, you can try RegExp: /${key}/`)
    );
    return;
  }
  await Promise.resolve(cache.it[key]());
  if (!cache.errors[key]) {
    logPass(key);
  }
  cache.done += 1;
  if (cache.done === Object.keys(cache.matchIt).length) {
    const doing = Object.keys(cache.matchIt);
    const errors = Object.keys(cache.errors);
    // 若是测试所有，不进行 test.config 调整
    if (!testAll()) {
      local.save(doing, errors);
    }
    if (errors.length === 0) {
      console.log(green(`PASS ALL, Done ${doing.length} case.`));
    } else {
      console.log(
        red(`FAIL, Done ${doing.length - errors.length}/${doing.length} case.`)
      );
    }
  }
}

async function runTest() {
  // 读取需要测试的对象
  const task = testAll()
    ? Object.keys(cache.it)
    : local.load(Object.keys(cache.it));

  task.forEach((key: string) => {
    cache.matchIt[key] = cache.it[key];
  });

  if (cache.before) {
    await Promise.resolve(cache.before());
  }
  const errs = Object.keys(cache.matchIt);
  console.log(gray("CURRENT TASK:"));
  errs.forEach((key) => {
    console.log(gray(`-- ${key}`));
  });
  console.log(" ");

  errs.forEach(runOne);
}

const test = {
  each: (fn: (key: string, testing: Function) => any) => {
    if (cache.each) {
      throw new Error("[bike] test.each can only be set once");
    }
    cache.each = fn;
  },
  before: (fn: Function) => {
    if (cache.before) {
      throw new Error("[bike] test.before can only be set once");
    }
    cache.before = fn;
  },
  it: (name: string, fn: (so: So) => any) => {
    if (cache.it[name]) {
      throw new Error(
        `Error: ${name} is defined test.it, keep test name is unique.`
      );
    }
    const so = createSo(name);
    cache.it[name] = async () => {
      await Promise.resolve(fn(so));
    };
  },
};

setTimeout(() => {
  // console.log(gray(`Auto watch last fails...`));
  // console.log(
  //   gray(
  //     `Auto watch last fails... Please input ${green("a")}: Run all; ${green(
  //       "t"
  //     )}: Text cover; ${green("h")}: Html cover.`
  //   )
  // );
  runTest();
}, 35);

export { test };
