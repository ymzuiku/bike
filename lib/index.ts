import { createSo, So } from "./so";
import { cache } from "./cache";
import { gray, green, logPass, red, title } from "./log";
import { event } from "./event";
import { resolve } from "path";

require("source-map-support").install();
const bikeTestAll = () => (global as any).bikeTestAll;
const bikeReporter = () => (global as any).bikeReporter;

let num = 0;

async function runOne(key: string) {
  num += 1;

  if (cache.each) {
    const fn = await Promise.resolve(cache.each(key, cache.it[key]));
    if (fn) {
      cache.it[key] = fn;
    }
  }
  if (!cache.it[key]) {
    console.error(
      red(`[${num}] ${key} is not match any test, you can try RegExp: /${key}/`)
    );
    return;
  }

  console.log("\t");
  console.log(title(`[${num}] ${key}:`));
  await Promise.resolve(cache.it[key]());

  cache.done += 1;

  if (cache.done === Object.keys(cache.matchIt).length) {
    console.log("\t");
    const doing = Object.keys(cache.matchIt);
    const errors = Object.keys(cache.errors);
    const all = Object.keys(cache.it);
    // 若是测试所有，不进行 test.config 调整
    if (!bikeTestAll()) {
      event.save(doing, errors, all);
    }
    if (errors.length === 0) {
      console.log(green(`PASS ALL, Done ${doing.length} case.`));
    } else {
      console.log(
        red(
          `FAIL: ${errors.length}, PASS: ${
            doing.length - errors.length
          }, ALL: ${doing.length}`
        )
      );
    }
    // console.log(gray(`Auto retest on change...`));
    if (bikeReporter() === "html") {
      console.log(
        `Coverage html at: ${resolve(process.cwd(), "coverage")}/index.html`
      );
    }
    console.log("\t");
  }
}

async function runTest() {
  // 读取需要测试的对象
  const task = bikeTestAll()
    ? Object.keys(cache.it)
    : event.load(Object.keys(cache.it));

  task.forEach((key: string) => {
    cache.matchIt[key] = cache.it[key];
  });

  if (cache.before) {
    await Promise.resolve(cache.before());
  }
  const errs = Object.keys(cache.matchIt);
  console.log(
    gray(
      `Match case ${errs.length}. Please press key: ${green(
        "a"
      )} retest all case, ${green("1~9")} focus number case, ${green(
        "q"
      )} quit.`
    )
  );

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

setTimeout(runTest, 30);

export { test };
