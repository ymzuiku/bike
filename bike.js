#!/usr/bin/env node

const { bike, loadArgs } = require("./bin");
const conf = loadArgs(process.argv);

bike(conf);
