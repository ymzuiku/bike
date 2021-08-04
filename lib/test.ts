import { resolve } from "path";
import fs from "fs-extra";
import { bike } from "./bike";
import type { Conf } from "./getConfig";
import { baseConfig } from "./baseConfig";

const cwd = process.cwd();

export const test = (config: Partial<Conf>) => {
  const conf = baseConfig(config);
  conf.entry = resolve(conf.out!, "__bike__.ts");
  if (!conf.watch) {
    conf.start = true;
  }

  const files: string[] = [];
  let waitGroup = 0;
  const reg = new RegExp(conf.match);

  function findTests(dir: string) {
    waitGroup += 1;
    fs.readdir(dir).then((list) => {
      list.forEach((file) => {
        waitGroup += 1;
        const p = resolve(dir, file);
        fs.stat(p).then((stat) => {
          if (stat.isDirectory()) {
            findTests(p);
          } else if (reg.test(file)) {
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
    findTests(resolve(cwd, conf.src));
    await new Promise((res) => {
      const stop = setInterval(() => {
        if (waitGroup == 0) {
          clearInterval(stop);
          res(void 0);
        }
      }, 20);
    });
    const code = files
      .map((file) => `import("${file.replace(/\.(ts|tsx|js|jsx)/, "")}");`)
      .join("\n");
    await fs.writeFile(
      conf.entry!,
      `global.bikeConf = ${JSON.stringify(conf)};
const { JSDOM } = require("jsdom");
const win = new JSDOM("", { pretendToBeVisual: true }).window;
global.window = win;
global.document = win.document;
global.fetch = require("node-fetch");
import { test } from "bike/test";
global.test = test;
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
