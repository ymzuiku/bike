const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();

let pkg = void 0;

function getPkg() {
  if (pkg !== undefined) {
    return pkg;
  }
  const pkgPath = resolve(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    pkg = require(pkgPath) || null;
  }
  return pkg;
}

module.exports = { getPkg };
