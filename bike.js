#!/usr/bin/env node

const { bike, getConfig } = require("./bin");
const conf = getConfig(process.argv);
if (conf.test) {
  const fn = require("./bin/test");
  fn(conf);
} else {
  bike(conf);
}
