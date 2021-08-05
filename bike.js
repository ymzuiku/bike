#!/usr/bin/env node

const { getConfig, bike, test } = require("./es-lib/index");
const conf = getConfig(process.argv);

if (conf.test) {
  test(conf);
} else {
  bike(conf);
}
