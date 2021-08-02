#!/usr/bin/env node

const { getConfig } = require("./bin/getConfig");
const conf = getConfig(process.argv);

if (conf.test) {
  const { test } = require("./bin/test");
  test(conf);
} else {
  const { bike } = require("./bin");
  bike(conf);
}
