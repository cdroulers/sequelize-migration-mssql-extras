'use strict';
var path = require('path');
var extend = require('util')._extend;

/**
 * Load database configuration from path in .sequelizerc or config/config.json
 *
 * @param {string} rootPath project root path
 * @returns {Object}
 */
module.exports = function loadConfiguration(rootPath, logOutput) {
  var configPath;
  try {
    configPath = require(path.join(rootPath, '.sequelizerc')).config;
    if (!configPath) {
      throw new Error();
    }
  } catch (err) {
    try {
      configPath = require(path.join(rootPath, "config/config.js"));
      configPath = path.join(rootPath, "config/config.js");
    }
    catch (err) {
      configPath = path.join(rootPath, 'config/config.json');
    }
  }

  var config;
  try {
    config = require(configPath);
    if (logOutput) {
      console.log('Using configuration in', configPath);
    }
  } catch (err) {
    if (logOutput) {
      console.error('Configuration not found in', configPath);
    }
    throw err;
  }

  var nodeEnv = process.env.NODE_ENV || "development";
  config = config[nodeEnv];
  if (!config) {
    const message = "Environment " + process.env.NODE_ENV + " not found in file " + configPath;
    if (logOutput) {
      console.error(message);
    }
    throw new Error(message);
  } else {
    return extend({}, config);
  }
};
