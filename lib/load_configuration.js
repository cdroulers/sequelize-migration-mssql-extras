'use strict';
var path = require('path');
var extend = require('util')._extend

/**
 * Load database configuration from path in .sequelizerc or config/config.json
 *
 * @param {string} rootPath project root path
 * @returns {Object}
 */
module.exports = function loadConfiguration(rootPath) {
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
    console.log('Using configuration in', configPath);
  } catch (err) {
    console.error('Configuration not found in', configPath);
    throw err;
  }

  var nodeEnv = process.env.NODE_ENV || "development";
  config = config[nodeEnv];
  if (!config) {
    console.error('Environment', process.env.NODE_ENV, 'not found in file', configPath);
    throw new Error('environment not found');
  } else {
    return extend({}, config);
  }
};
