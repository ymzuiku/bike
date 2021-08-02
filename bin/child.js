const { spawn } = require("child_process");

let lastChild = null;

function child(conf) {
  if (lastChild) {
    lastChild.kill(0);
    lastChild = null;
  }

  let c8 = [];
  if (conf.reporter) {
    c8 = [
      "c8",
      `-r=${conf.reporter}`,
      ...(conf.c8Include ? ["--include", conf.c8Include] : []),
      ...(conf.c8Config ? ["--config", conf.c8Config] : []),
      "--exclude",
      ["./coverage", "./node_modules", conf.c8Exclude]
        .filter(Boolean)
        .join(","),
      conf["c8-skip-full"] == true && "--skip-full",
    ];
  }
  const ls = spawn(
    "npx",
    [
      ...c8,
      "node",
      conf.out + "/" + conf.outfile,
      ...conf.argv,
      "--color",
    ].filter(Boolean),
    {
      stdio: "inherit",
    }
  );
  lastChild = ls;

  return ls;
}

module.exports = { child };
