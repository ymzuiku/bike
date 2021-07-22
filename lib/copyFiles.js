const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();
const { getPkg } = require("./getPkg");

function copyFiles() {
  const pkg = getPkg();
  return new Set([
    ".env",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    ...(pkg.copyFiles || []),
  ]);
}

module.exports = { copyFiles };
