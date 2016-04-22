#!/usr/bin/env node
"use strict";

const shouldKillAllConnections = process.argv.filter(x => x === "--kill" || x === "-k").length === 1;
const shouldShowHelp = process.argv.filter(x => x === "--help" || x === "-h").length === 1;

if (shouldShowHelp) {
  console.log("Small utility to drop an MSSQL database.");
  console.log();
  console.log("Usage: node lib/drop_database.js [-k] [-h]");
  console.log();
  console.log("Options");
  console.log("  --kill, -k     Kill all connections to the database currently deleting.");
  console.log("  --help, -h     Show this text.");
  console.log();
  console.log("The connection info will be read from .sequelizerc, config/config.js or config/config.json, " +
    "whichever comes first.");
} else {
  const shared = require("./shared");
  const config = require("./load_configuration")(process.cwd(), true);

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  console.log('Using NODE_ENV=' + process.env.NODE_ENV);

  shared.drop(config, shouldKillAllConnections);
}
