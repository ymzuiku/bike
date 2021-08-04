import child_process from "child_process";
import type { Conf } from "./getConfig";

let lastChild: any = null;

export function spawn(conf: Conf) {
  if (lastChild) {
    lastChild.kill(0);
    lastChild = null;
  }

  let c8: any[] = [];
  const c8Include: string[] = [];
  if (conf["c8-include"]?.length) {
    conf["c8-include"].forEach((k) => {
      c8Include.push("--include");
      c8Include.push(k as string);
    });
  }

  const c8Exclude: string[] = [
    "--exclude",
    "./coverage",
    "--exclude",
    "./node_modules",
    "--exclude",
    ".vscode",
  ];
  if (conf["c8-exclude"]?.length) {
    conf["c8-exclude"].forEach((k) => {
      c8Exclude.push("--exclude");
      c8Exclude.push(k as string);
    });
  }

  if (conf.reporter) {
    c8 = [
      "c8",
      `-r=${conf.reporter}`,
      ...c8Include,
      ...c8Exclude,
      ...(conf["c8-config"] ? ["--config", conf["c8-config"]] : []),
      conf["c8-skip-full"] == true && "--skip-full",
    ];
  }

  const ls = child_process.spawn(
    "npx",
    [
      ...c8,
      "node",
      conf.out + "/" + conf.outfile,
      ...(conf.argv as string[]),
      "--color",
    ].filter(Boolean),
    {
      stdio: "inherit",
    }
  );
  lastChild = ls;

  return ls;
}
