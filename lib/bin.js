#!/usr/bin/env node

const { bike, loadArgs } = require("./index");

bike(loadArgs(process.argv.splice(2)));
