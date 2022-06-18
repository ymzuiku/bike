#!/usr/bin/env node
require("source-map-support").install();

const argv = process.argv.splice(2);
const child_process = require("child_process");
const fs = require("fs");
const { resolve } = require("path");
const esbuild = require("esbuild");
const pkg = require("./package.json");

const cwd = (...args) => resolve(process.cwd(), ...args);
const entryfile = argv[0];
const outfile = argv[1];
const isDev = argv[2] === "--dev";
const isWatch = argv[2] === "--watch";
const isBrowser = argv[2] === "--browser";
const isBuild = argv[2] === "--build";
const isCrypto = argv[2] === "--crypto";
const isBytecode = argv[2] === "--byte";
const isCryptoBytecode = argv[2] === "--crypto-byte";
const depend = Object.keys({ ...pkg.devDependencies, ...pkg.dependencies });
let worker;

function serve() {
  if (worker) {
    worker.kill(1);
    worker = null;
  }
  worker = child_process.spawn("node", [cwd(outfile)], {
    stdio: "inherit",
  });
}

const builder = (enter, external, allowOverwrite) => {
  return esbuild.build({
    entryPoints: [enter],
    outfile: isBrowser ? undefined : outfile,
    outdir: isBrowser ? outfile : undefined,
    bundle: true,
    minify: true,
    target: ["node16"],
    format: isBrowser ? "esm" : "cjs",
    platform: isBrowser ? "browser" : "node",
    splitting: isBrowser,
    sourcemap: isDev || isWatch || isBrowser,
    inject: isDev || isWatch ? [resolve(__dirname, "./inject.js")] : [],
    allowOverwrite: allowOverwrite,
    external: external || [],
    watch:
      isDev || isWatch || isBrowser
        ? {
            onRebuild(error, result) {
              if (error) {
                console.log("__debug__", error);
              } else if (isDev) {
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
  } else if (isBrowser) {
    const liveServer = require("live-server");

    const params = {
      port: 3366, // Set the server port. Defaults to 8080.
      host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
      root: cwd(outfile), // Set root directory that's being served. Defaults to cwd.
      open: false, // When false, it won't load your browser by default.
      ignore: "scss,my/templates", // comma-separated string for paths to ignore
      file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
      wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
      // mount: [["/components", "./node_modules"]], // Mount a directory to a route.
      logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
      // middleware: [
      //   function (req, res, next) {
      //     next();
      //   },
      // ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
    };
    liveServer.start(params);
  }
});
