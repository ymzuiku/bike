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
      pkg.noBundleDependencies.forEach((k: string) => {
        pkg.dependencies[k] = oldDepend[k];
      });
    }
  }
  fs.writeJSONSync(resolve(conf.out!, "package.json"), pkg, { spaces: 2 });

  // 拷贝常见的依赖版本锁
  ["pnpm-lock.yaml", "yarn.lock", "package-lock.json"].forEach((v) => {
    if (fs.existsSync(resolve(cwd, v))) {
      fs.copySync(resolve(cwd, v), resolve(conf.out!, v));
    }
  });
}
