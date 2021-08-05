/* c8 ignore start */
import chalk from "chalk";

const cwd = process.cwd() + "/";
const cwdReg = new RegExp(cwd + ".*(.ts)");
const nodeModulesReg = new RegExp("node_modules");

export const gray = (str: string) => chalk.gray(str);
export const title = (str: string) => chalk.bold.white(str);
export const white = (str: string) => chalk.whiteBright(str);
export const green = (str: string) => chalk.green(str);
export const greenBold = (str: string) => chalk.bold.green(str);
export const red = (str: string) => chalk.bold.redBright(str);

export function logFail(name: string, stack: string) {
  stack
    .split("\n")
    .reverse()
    .forEach((code) => {
      if (/Error: /.test(code)) {
        const [_, ...rest] = code.split("Error: ");
        code = rest.join("Error: ");
        console.log(red(code));
      }
      if (nodeModulesReg.test(code)) {
        return;
      }
      if (cwdReg.test(code)) {
        console.log(gray(`${code.split(cwd)[1]}`));
      }
    });

  // console.log("\t");
}

export function logPass(name: string) {
  console.log(`${green("- PASS")} ${green(name)}`);
}
