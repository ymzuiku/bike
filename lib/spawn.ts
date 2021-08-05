/* c8 ignore start */
import child_process from "child_process";
import path from "path";
import type { Conf } from "./getConfig";

let lastChild: any = null;
const cwd = process.cwd();

export function spawn(conf: Conf) {
  if (lastChild) {
    lastChild.kill(0);
    lastChild = null;
  }

  let c8: any[] = [];

  const defaultExtension = [".js", ".cjs", ".mjs", ".ts", ".tsx", ".jsx"];
  const testFileExtensions = defaultExtension
    .map((extension) => extension.slice(1))
    .join(",");

  const _c8Include: string[] = [];
  if (conf["c8-include"]?.length) {
    conf["c8-include"].forEach((k) => {
      _c8Include.push(k as string);
    });
  }

  const c8Include: string[] = [];
  _c8Include.forEach((k) => {
    c8Include.push("--include");
    c8Include.push(k);
  });

  const _c8Exclude: string[] = [
    "coverage/**",
    "packages/*/test{,s}/**",
    "**/*.d.ts",
    "test{,s}/**",
    `test{,-*}.{${testFileExtensions}}`,
    `**/*{.,-}test.{${testFileExtensions}}`,
    "**/__tests__/**",

    /* Exclude common development tool configuration files */
    "**/{ava,babel,nyc}.config.{js,cjs,mjs}",
    "**/jest.config.{js,cjs,mjs,ts}",
    "**/{karma,rollup,webpack}.config.js",
    "**/.{eslint,mocha}rc.{js,cjs}",
  ];
  if (conf["c8-exclude"]?.length) {
    conf["c8-exclude"].forEach((k) => {
      _c8Exclude.push(k as string);
    });
  }
  const c8Exclude: string[] = [];
  _c8Exclude.forEach((k) => {
    c8Exclude.push("--exclude");
    c8Exclude.push(k);
  });

  if (conf.reporter) {
    c8 = [
      "c8",
      `-r=${conf.reporter}`,
      "--src",
      path.resolve(cwd, conf.source!),
      ...c8Include,
      ...c8Exclude,
      // ...(conf["c8-config"] ? ["--config", conf["c8-config"]] : []),
      conf["c8-all"] && "--all",
      conf["c8-skip-full"] == true && "--skip-full",
    ].filter(Boolean);
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
