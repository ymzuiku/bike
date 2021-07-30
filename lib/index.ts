import { createSo, So } from "./so";
import { cache } from "./cache";
import { gray, green } from "./log";

function runTest() {
  const errs = Object.keys(cache.errors);
  if (errs.length > 0) {
    errs.forEach((key) => {
      cache.it[key]();
    });
    return;
  }
  const errs2 = Object.keys(cache.it);
  errs2.forEach((key) => {
    cache.it[key]();
  });
}

const test = {
  it: (name: string, fn: (so: So) => any) => {
    const so = createSo(name);
    cache.it[name] = () => {
      fn(so);
    };
  },
};

setTimeout(() => {
  console.log(
    gray(
      `Please input ${green("f")}: Run last fail; ${green(
        "e"
      )}: Run each fail; ${green("a")}: Run all; ${green(
        "t"
      )}: Text cover; ${green("h")}: Html cover.`
    )
  );
  runTest();
}, 35);

export { test };
