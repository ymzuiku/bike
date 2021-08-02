const cwd = process.cwd();
const resolve = require("path").resolve;
const fs = require("fs-extra");
const { bike } = require("./index");

const test = (conf) => {
  conf.entry = resolve(conf.out, "index.ts");
  if (!conf.watch) {
    conf.start = true;
  }

  const files = [];
  let waitGroup = 0;
  const reg = new RegExp(conf.match);

  function findTests(dir) {
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

  if (!fs.existsSync(conf.out)) {
    fs.mkdirpSync(conf.out);
  }

  async function createCode() {
    findTests(resolve(cwd, conf.src));
    await new Promise((res) => {
      const stop = setInterval(() => {
        if (waitGroup == 0) {
          clearInterval(stop);
          res();
        }
      });
    }, 20);
    const code = files.map((file) => `import "${file}";`).join("\n");
    await fs.writeFile(
      conf.entry,
      `${code}

global.bikeTestAll = ${conf.all};
global.bikeReporter = "${conf.reporter || "none"}";
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

module.exports = { test };
