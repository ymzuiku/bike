const { spawn } = require("child_process");

let lastChild = null;
let coverMatch = new RegExp("----|----");

function log(data) {
  const base = data.toString("utf8");
  const v = data.toString("utf8").trim();
  if (!v) {
    return;
  }
  console.log(base);
}

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

  // if (conf.reporter === "text" && conf.reporterMini) {
  //   let isInCover = false;
  //   ls.stdout.on("data", (data) => {
  //     if (!isInCover && coverMatch.test(data)) {
  //       isInCover = true;
  //     }
  //     if (isInCover) {
  //       const table = data.toString().split("\n");
  //       if (/|/.test(table)) {
  //         const subTable = table.toString().split("\n");
  //         subTable.forEach((line) => {
  //           const list = line.toString().split("|");
  //           process.stdout.write(
  //             [list[0], list[list.length - 2], list[list.length - 1]].join(
  //               "|"
  //             ) + "\n"
  //           );
  //         });
  //       } else {
  //         // console.log(table);
  //         table.forEach((line) => {
  //           const list = line.toString().split("|");
  //           process.stdout.write(
  //             [list[0], list[list.length - 2], list[list.length - 1]].join(
  //               "|"
  //             ) + "\n"
  //           );
  //         });
  //       }

  //       // const list = data.toString().split("|");
  //       // console.log(list);
  //       // process.stdout.write(
  //       //   [list[0], list[list.length - 2], list[list.length - 1]].join("|")
  //       // );
  //     } else {
  //       process.stdout.write(data);
  //     }
  //   });
  // } else {
  //   ls.stdout.on("data", (data) => {
  //     process.stdout.write(data);
  //   });
  // }

  ls.stderr.on("data", (data) => {
    process.stdout.write(data);
  });
  return ls;
}

module.exports = child;
