#!/usr/bin/env node

const { air, loadArgs } = require("./index");

air(loadArgs(process.argv.splice(2)));
