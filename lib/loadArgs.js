function loadArgs(argv) {
  let isWatch = false;

  argv.forEach((item) => {
    if (/(-w|--watch)/.test(item)) {
      isWatch = true;
    }
  });

  const src = argv[0];
  let out = isWatch ? process.cwd() + "/node_modules/.bike_dist" : "dist";
  let staticDir = "static";
  let entry = src + "/index.ts";
  let clear = true;
  let sourcemap = undefined;

  argv.forEach((item) => {
    if (/--static/.test(item)) {
      staticDir = item.split("=")[1];
    } else if (/--entry/.test(item)) {
      entry = item.split("=")[1];
    } else if (/--out/.test(item)) {
      out = item.split("=")[1];
    } else if (/--sourcemap/.test(item)) {
      sourcemap = item.split("=")[1];
    } else if (/--no-clear/.test(item)) {
      clear = false;
    }
  });

  return { out, staticDir, isWatch, src, entry, clear, sourcemap };
}

module.exports = loadArgs;
