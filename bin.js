#!/usr/bin/env node
require("source-map-support").install();

const { resolve } = require("path");
const cwd = (...args) => resolve(process.cwd(), ...args);
const argv = process.argv.splice(2);
const child_process = require("child_process");
const fs = require("fs");
const esbuild = require("esbuild");
const pkg = require("./package.json");
const pkg2 = require(cwd("./package.json"));
const { exit } = require("process");

let entryfile = argv[0];
let outfile = argv[1];
let copyFileIn = "";
let copyFileOut = "";
const split = "@";

if (entryfile.indexOf(split) > -1) {
  const [a, b] = entryfile.split(split);
  entryfile = a;
  copyFileIn = b;
  if (outfile.indexOf(split) > -1) {
    const [a, b] = outfile.split(split);
    outfile = a;
    copyFileOut = b;
  }
  if (!copyFileIn || !copyFileOut) {
    throw Error("[bike] enrtyfile or outfile is error");
  }
}
const isDev = argv[2] === "--dev";
const isWatch = argv[2] === "--watch";
const isBrowser = argv[2] === "--browser";
const isBuild = argv[2] === "--build";
const isCrypto = argv[2] === "--crypto";
const isBytecode = argv[2] === "--byte";
const isCryptoBytecode = argv[2] === "--crypto-byte";
const killPort = argv[3];
const { kill } = require("cross-port-killer");
const runner = argv[4] || "node";
const otherArgs = (argv.join(" ").split("--")[1] || "").split(" ");

let config = {};
if (fs.existsSync(cwd("bike.config.js"))) {
  config = require(cwd("bike.config.js"));
}

const pkgs = {
  // "pg-native": "1",
  // "source-map-support": 1,
  // path: "1",
  // fs: "1",
  // tinypool: "1",
  // piscina: "1",
  ...pkg.devDependencies,
  ...pkg.dependencies,
  ...pkg2.devDependencies,
  ...pkg2.dependencies,
};

const keep = {
  nanoid: 1,
};

const depend = Object.keys(pkgs).filter((k) => {
  if (keep[k]) {
    return false;
  }
  return !/workspace/.test(pkgs[k]);
});

let worker;

if (!fs.existsSync(entryfile)) {
  console.error("Not found file:", entryfile);
  exit(1);
}

async function serve() {
  if (killPort) {
    await kill(killPort);
    console.log(`[bike] kill port: ${killPort}`);
  }

  if (worker) {
    try {
      worker.kill(1);
      worker = null;
    } catch (err) {}
  }
  worker = child_process.spawn(runner, [cwd(copyFileOut || outfile), ...otherArgs], {
    stdio: "inherit",
  });
}

const builder = (enter, external, allowOverwrite) => {
  return esbuild.build({
    entryPoints: [enter],
    outfile: isBrowser ? undefined : outfile,
    outdir: isBrowser ? outfile : undefined,
    bundle: true,
    minify: !(isDev || isWatch || isBrowser),
    target: ["node16"],
    format: isBrowser ? "esm" : "cjs",
    // format: "esm",
    platform: isBrowser ? "browser" : "node",
    splitting: isBrowser,
    ignoreAnnotations: !(isDev || isWatch || isBrowser),
    treeShaking: true,
    define: {
      "import.meta.vitest": "false",
      "import_meta.vitest": "false",
    },
    sourcemap: isDev || isWatch || isBrowser,
    inject: isDev || isWatch ? [resolve(__dirname, "./inject.js")] : [],
    allowOverwrite: allowOverwrite,
    external: [...external, "pg-native"] || [],
    ...config,
    watch:
      isDev || isWatch || isBrowser
        ? {
            onRebuild(error, result) {
              if (error) {
                console.log("rebuild error: ", error);
              } else if (isDev) {
                copyTheOutFile();
                serve();
              }
            },
          }
        : undefined,
  });
};

const buildRelease = async () => {
  const { code } = await require("@vercel/ncc")(cwd(outfile), {
    cache: false,
    filterAssetBase: process.cwd(), // default
    minify: true, // default
    sourceMap: false, // default
    assetBuilds: false, // default
    quiet: false, // default
    debugLog: false, // default
  });
  fs.writeFileSync(cwd(outfile), code);
};

const buildByte = async () => {
  const bytenode = require("bytenode");
  bytenode.compileFile({
    filename: cwd(outfile),
    output: cwd(outfile) + "c",
  });
  fs.writeFileSync(cwd(outfile), `require("bytenode");`);
  builder(outfile, ["electron"], true).then(() => {
    const code3 = fs.readFileSync(cwd(outfile)).toString();
    const inputC = `require("./${outfile.split("/").pop()}c");`;
    const end = [code3, inputC].join("\n");
    fs.writeFileSync(cwd(outfile), end, null);
  });
};

const buildCrypto = async () => {
  var JavaScriptObfuscator = require("javascript-obfuscator");
  const code = fs.readFileSync(cwd(outfile)).toString();
  const obfuscatorRes = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    target: "node",
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: "mangled-shuffled",
    log: false,
    // transformObjectKeys: true,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    exclude: depend.map((v) => `require("${v}")`).concat(depend),
    // splitStrings: true,
    // splitStringsChunkLength: 7,
    ignoreImports: true,
    stringArray: true,
    stringArrayCallsTransform: false,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: [],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: "variable",
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false,
  });
  const obf = obfuscatorRes.getObfuscatedCode();
  fs.writeFileSync(cwd(outfile), obf);
};

const copyTheOutFile = async () => {
  if (copyFileIn && copyFileOut) {
    const code = fs.readFileSync(cwd(copyFileIn)).toString();
    fs.writeFileSync(cwd(copyFileOut), code);
  }
};

builder(cwd(entryfile), depend).then(async (result) => {
  if (isDev) {
    serve();
  } else if (isBuild) {
    console.log("building release...");
    await buildRelease();
  } else if (isCrypto) {
    console.log("building crypto...");
    await buildRelease();
    await buildCrypto();
  } else if (isBytecode) {
    console.log("building bytenode...");
    await buildRelease();
    await buildByte();
  } else if (isCryptoBytecode) {
    console.log("building crypto+bytenode...");
    await buildRelease();
    await buildCrypto();
    await buildByte();
  }
  copyTheOutFile();
});
