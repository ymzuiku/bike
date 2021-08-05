/* c8 ignore start */
import eq from "fast-deep-equal";
import { cache } from "./cache";
import { logFail } from "./log";

export function createSo(name: string) {
  return {
    pick: (a: any, ...b: any[]) => {
      let isPick = false;
      b.forEach((v) => {
        if (a === b) {
          isPick = true;
        }
      });
      if (!isPick) {
        cache.errors[name] = new Error(`${a} isn't pick: ${b}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    reg: (a: string, regex: RegExp) => {
      if (regex.test(a)) {
        return;
      }
      cache.errors[name] = new Error(`${a} isn't regexp: ${regex}`);
      logFail(name, cache.errors[name].stack!);
    },
    notReg: (a: string, regex: RegExp) => {
      if (!regex.test(a)) {
        return;
      }
      cache.errors[name] = new Error(`${a} is regexp: ${regex}`);
      logFail(name, cache.errors[name].stack!);
    },
    notPick: (a: any, ...b: any[]) => {
      let isPick = false;
      b.forEach((v) => {
        if (a === b) {
          isPick = true;
        }
      });
      if (isPick) {
        cache.errors[name] = new Error(`${a} is pick: ${b}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    true: (a: any) => {
      if (!a) {
        cache.errors[name] = new Error(`${a} isn't true`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    false: (a: any) => {
      if (a) {
        cache.errors[name] = new Error(`${a} isn't false`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    equal: (a: any, b: any) => {
      if (a !== b) {
        cache.errors[name] = new Error(`${a} isn't equal ${b}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    notEqual: (a: any, b: any) => {
      if (a === b) {
        cache.errors[name] = new Error(`${a} is equal ${b}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    deepEqual: (a: any, b: any) => {
      if (!eq(a, b)) {
        cache.errors[name] = new Error(`${a} isn't deep equal ${b}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    notDeepEqual: (a: any, b: any) => {
      if (eq(a, b)) {
        cache.errors[name] = new Error(`${a} is deep equal ${b}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    unique: (list: Array<any>) => {
      const out = new Set(list);
      if (out.size !== list.length) {
        cache.errors[name] = new Error(`${list} isn't unique`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    error: (err?: Error | null, regex?: RegExp) => {
      if (!err) {
        cache.errors[name] = new Error(`${err} isn't error`);
        logFail(name, cache.errors[name].stack!);
        return;
      }

      if (regex && !regex.test(err.message)) {
        cache.errors[name] = new Error(`error ${err} isn't regex ${regex}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    string: (target: string, has: string) => {
      if (!target) {
        cache.errors[name] = new Error(`error isn't Error`);
        logFail(name, cache.errors[name].stack!);
        return;
      }
      if ((!has && target) || target.indexOf(has) > -1) {
        cache.errors[name] = new Error(`error ${target} isn't ${has}`);
        logFail(name, cache.errors[name].stack!);
      }
    },
    fail: (msg: string) => {
      if (msg !== undefined && msg !== "" && msg !== null) {
        cache.errors[name] = new Error(msg);
        logFail(name, cache.errors[name].stack!);
      }
    },
  };
}

const _so = createSo("");
export type So = typeof _so;
