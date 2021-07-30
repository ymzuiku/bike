const path = require("path");

function c8(conf) {
  const { spawn } = require("child_process");
  const ls = spawn(
    "c8",
    [
      `-r=${conf.reporter}`,
      // "--wrapper-length",
      // "150",
      ...(conf.c8Include ? ["--include", conf.c8Include] : []),
      ...(conf.c8Config ? ["--config", conf.c8Config] : []),
      // ...(conf.c8Exclude ? ["--exclude", conf.c8Exclude] : []),
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

  ls.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.error(`${data}`);
  });

  ls.on("close", (code) => {
    if (conf.reporter === "html") {
      console.log(`Builded reporter html:`);
      console.log(`${path.resolve(process.cwd(), "coverage")}/index.html`);
    }
  });
}

module.exports = c8;
