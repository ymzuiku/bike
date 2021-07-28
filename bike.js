#!/usr/bin/env node

const { bike, loadArgs } = require("./lib");
const conf = loadArgs(process.argv);

bike(conf);
