#!/usr/bin/env node

const { getConfig } = require("./bin");
const conf = getConfig(process.argv);
if (conf.test) {
  const fn = require("./bin/test");
  fn(conf);
} else {
  const fn = require("./bin/serve");
  fn(conf);
}
