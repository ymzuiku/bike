import eq from "fast-deep-equal";
console.log("tdddddddddd");

const cache = {} as { [key: string]: Function };
const lastErrors = {} as { [key: string]: Error };

// function clear(obj: any) {
//   Object.keys(obj).forEach((k) => {
//     delete obj[k];
//   });
// }

function failText(name: string) {
  return `-- FAIL ${name}:\n`;
}

function passText(name: string) {
  return `-- PASS ${name}:\n`;
}

function getLine() {
  // let err = new Error();
  // const strErr = err.stack!;
  // const strLineErr = strErr.split(/\r|\n/)[3];
  // const arrErrResult = strLineErr.match(/[^/|:|\\]{1,}/gi);
  // const temp = {} as any;
  // return {
  //   colNum: arrErrResult!.pop()!.replace(")", ""),
  //   lineNum: arrErrResult!.pop(),
  //   fileName: "/" + arrErrResult!.slice(1).join("/"),
  // };
  let obj = {} as any;
  Error.captureStackTrace(obj, getLine);
  return obj.stack;
}

function createSo(name: string) {
  return {
    pick: (a: any, ...b: any[]) => {
      let isPick = false;
      b.forEach((v) => {
        if (a === b) {
          isPick = true;
        }
      });
      if (!isPick) {
        lastErrors[name] = new Error(`${a} isn't pick: ${b}`);
        console.error(failText(name), lastErrors[name]);
      }
    },
    notPick: (a: any, ...b: any[]) => {
      let isPick = false;
      b.forEach((v) => {
        if (a === b) {
          isPick = true;
        }
      });
      if (isPick) {
        lastErrors[name] = new Error(`${a} is pick: ${b}`);
        console.error(failText(name), lastErrors[name]);
      }
    },
    true: (a: any) => {
      if (!a) {
        lastErrors[name] = new Error(`${a} isn't true`);
        console.error(failText(name), lastErrors[name]);
      }
    },
    false: (a: any) => {
      if (a) {
        lastErrors[name] = new Error(`${a} isn't false`);
        console.error(failText(name), lastErrors[name]);
      }
    },
    equal: (a: any, b: any) => {
      if (!eq(a, b)) {
        lastErrors[name] = new Error(`${a} isn't equal ${b}`);
        // console.error(failText(name), lastErrors[name]);
        console.error(
          lastErrors[name]
            .stack!.split("\n")[2]
            .match(/\(.*\)/)![0]
            .replace(/(\(|\))/g, "")
        );
      }
    },
    notEqual: (a: any, b: any) => {
      if (eq(a, b)) {
        lastErrors[name] = new Error(`${a} is equal ${b}`);
        console.error(failText(name), lastErrors[name]);
      }
    },
    unique: (list: Array<any>) => {
      const out = new Set(list);
      if (out.size !== list.length) {
        lastErrors[name] = new Error(`${list} isn't unique`);
        console.error(failText(name), lastErrors[name]);
      }
    },
    error: (err: Error, other: Error) => {
      if (!err) {
        lastErrors[name] = new Error(`error isn't Error`);
        console.error(failText(name), lastErrors[name]);
        return;
      }
      if (err.message.indexOf(other.message) > -1) {
        lastErrors[name] = new Error(`error ${err} isn't ${other}`);
        console.error(lastErrors[name]);
      }
    },
    fail: (err: Error) => {
      lastErrors[name] = new Error(err.message);
      console.error(failText(name), lastErrors[name]);
    },
  };
}

const _so = createSo("");
type So = typeof _so;

// async function runAsyncTest() {
//   const errs = Object.keys(lastErrors);
//   clear(lastErrors);
//   if (errs.length > 0) {
//     for (const key of errs) {
//       console.log(key);
//       await Promise.resolve(cache[key]());
//     }
//     return;
//   }
//   const errs2 = Object.keys(cache);
//   for (const key of errs2) {
//     console.log(key);
//     await Promise.resolve(cache[key]());
//   }
// }

function runTest() {
  const errs = Object.keys(lastErrors);
  if (errs.length > 0) {
    errs.forEach((key) => {
      console.log(key);
      cache[key]();
    });
    return;
  }
  const errs2 = Object.keys(cache);
  errs2.forEach((key) => {
    console.log(key);
    cache[key]();
  });
}

function check() {
  runTest();
}

const test = {
  core: {
    cache,
    check,
    lastErrors,
    runTest,
  },
  it: (name: string, fn: (so: So) => any) => {
    const so = createSo(name);
    cache[name] = () => {
      fn(so);
    };
  },
};

setTimeout(() => {
  test.core.check();
}, 50);

export { test };
