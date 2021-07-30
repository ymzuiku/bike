import chalk from "chalk";

const cwd = process.cwd() + "/";
const cwdReg = new RegExp(cwd + ".*(.ts)");

export const gray = (str: string) => chalk.gray(str);
export const white = (str: string) => chalk.whiteBright(str);
export const green = (str: string) => chalk.green(str);
export const red = (str: string) => chalk.bold.redBright(str);

export function logFail(name: string, stack: string) {
  stack.split("\n").forEach((line) => {
    if (/Error: /.test(line)) {
      console.log(" ");
      const [_, ...rest] = line.split("Error: ");
      line = rest.join("Error: ");
      console.log(`${red("-- Fail")} ${gray(name + ":")} ${white(line)}`);
    }
    if (cwdReg.test(line)) {
      console.log(green(`   ${line.split(cwd)[1]}`));
    }
  });
}
