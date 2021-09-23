/* c8 ignore start */
import fs from "fs-extra";
import { resolve } from "path";
import type { Conf } from "./getConfig";
const cwd = process.cwd();

export function copyPackage(conf: Conf) {
  const pkgPath = resolve(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return;
  }
  const pkg = require(pkgPath) || null;
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg["lint-staged"];
  if (conf.depend && pkg.dependencies) {
    if (!pkg.noBundleDependencies) {
      delete pkg.dependencies;
    } else {
      const oldDepend = pkg.dependencies;
      pkg.dependencies = {};
      Object.keys(pkg.noBundleDependencies).forEach((k) => {
        pkg.dependencies[k] = oldDepend[k];
      });
    }
  }
  fs.writeJSONSync(resolve(conf.out!, "package.json"), pkg, { spaces: 2 });
}
