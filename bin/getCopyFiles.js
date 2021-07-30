const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();
const { getPkg } = require("./getPkg");

function getCopyFiles(conf) {
  const pkg = getPkg();
  // let lock = [];
  // if (conf.watch) {
  //   lock = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock"];
  // }
  return new Set([".env", ...(conf.copy || [])]);
}

module.exports = { getCopyFiles };
