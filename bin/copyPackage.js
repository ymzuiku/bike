const fs = require("fs-extra");
const { resolve } = require("path");
const cwd = process.cwd();

function copyPackage(conf) {
  const pkgPath = resolve(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    pkg = require(pkgPath) || null;
  }
  delete pkg.devDependencies;
  fs.writeJSONSync(resolve(conf.out, "package.json"), pkg, { spaces: 2 });
}

module.exports = { copyPackage };
