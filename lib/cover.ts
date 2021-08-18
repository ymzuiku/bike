import { Report } from "c8";
import { resolve } from "path";
import { Conf } from "./getConfig";

const defaultExtension = [".js", ".cjs", ".mjs", ".ts", ".tsx", ".jsx"];
const testFileExtensions = defaultExtension
  .map((extension) => extension.slice(1))
  .join(",");

const exclude: string[] = [
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

export const cover = (conf: Conf) => {
  const report = new Report({
    // all: true,
    // omitRelative: true,
    // src: [resolve(process.cwd(), conf.source)],
    // resolve: process.cwd(),
    reporter: ["text"],
    // exclude,
  });

  report.run().then((v) => {
    console.log(v);
  });
};
