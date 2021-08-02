const path = require("path");

function c8(conf) {
  const { spawn } = require("child_process");
  const ls = spawn(
    "npx",
    [
      "c8",
      `-r=${conf.reporter}`,
      ...(conf.c8Include ? ["--include", conf.c8Include] : []),
      ...(conf.c8Config ? ["--config", conf.c8Config] : []),
      "--exclude",
      ["./coverage", "./node_modules", conf.c8Exclude]
        .filter(Boolean)
        .join(","),
      conf["skip-full"] == true && "--skip-full",
      "--clean",
      "node",
      conf.out + "/index.js",
    ].filter(Boolean)
  );

  let atC8 = false;
  ls.stdout.on("data", (data) => {
    if (conf.reporter === "html") {
      return;
    }
    if (!atC8 && /% Stmts/.test(data)) {
      atC8 = true;
    }
    if (!atC8) {
      return;
    }
    console.log(`${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.log(`${data}`);
  });

  ls.on("close", (code) => {
    if (conf.reporter === "html") {
      console.log(`Builded reporter html:`);
      console.log(`${path.resolve(process.cwd(), "coverage")}/index.html`);
    }
  });
}

module.exports = c8;
