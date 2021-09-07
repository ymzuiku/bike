import path from "path";
import fs from "fs-extra";
import { bike } from "./bike";
import type { Conf } from "./getConfig";
import { baseConfig } from "./baseConfig";

const cwd = process.cwd();

export const test = (config: Partial<Conf>) => {
  if (!config.watch) {
    config.start = true;
  }
  const conf = baseConfig(config);
  conf.entry = path.resolve(conf.out!, "bike.temp.ts");

  const files: string[] = [];
  let waitGroup = 0;
  const include = new RegExp(conf["test-include"]);

  function findTests(dir: string) {
    waitGroup += 1;
    fs.readdir(dir).then((list) => {
      list.forEach((file) => {
        waitGroup += 1;
        const p = path.resolve(dir, file);
        fs.stat(p).then((stat) => {
          if (stat.isDirectory()) {
            findTests(p);
          } else if (include.test(file)) {
            files.push(p);
          }
          waitGroup -= 1;
        });
      });
      waitGroup -= 1;
    });
  }

  if (!fs.existsSync(conf.out!)) {
    fs.mkdirpSync(conf.out!);
  }

  async function createCode() {
    conf.source.split(",").forEach((src) => {
      findTests(path.resolve(cwd, src));
    });
    await new Promise((res) => {
      const stop = setInterval(() => {
        if (waitGroup == 0) {
          clearInterval(stop);
          res(void 0);
        }
      }, 20);
    });
    const code = files
      .map((file) => {
        file = path.relative(path.join(cwd, conf.out!), file);
        file = file.replace(/\.(tsx|jsx)/g, "");
        file = file.replace(/\.(ts|js)/g, "");
        file = file.replace(/\\/g, "/");
        return `import("${file}");`;
      })
      .join("\n");
    await fs.writeFile(
      conf.entry!,
      `/* c8 ignore start */
// THIS FILE IS AUTO GENERATE, DON'T EDIT.
// tslint:disable
/* eslint-disable */
(global as any).fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const win = new JSDOM("", { pretendToBeVisual: true }).window;
(global as any).window = win;
(global as any).document = win.document;
(global as any).bikeConf = ${JSON.stringify(conf)};
${code}
`
    );
  }

  let createdCoded = false;

  async function before() {
    if (!createdCoded || conf.rematch) {
      await createCode();
      createdCoded = true;
    }
  }

  bike({ ...conf, before });
};
