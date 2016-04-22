"use strict";
var chai = require("chai");
var expect = chai.expect;
var asPromised = require("chai-as-promised");
var extend = require('util')._extend;
chai.use(asPromised);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var shared = require("../lib/shared");

const config = {
  "username": "mssql",
  "password": "mssql",
  "database": "sequelize_migration_mssql_extras_development" + (Math.random().toString().split(".")[1]),
  "host": "127.0.0.1",
  "dialect": "mssql"
}

/*
  Quality tests right here!
  They need to be run order to work!
 */
describe("Shared library", () => {
  describe("create database", () => {
    it("doesn't explode when it doesn't exist", (done) => {
      const p = shared.create(config);
      expect(p).to.eventually.deep.equal({ message: "Database " + config.database + " created" }).notify(done);
    });

    it("reports success when it already exists", (done) => {
      let newConfig = extend({}, config);
      newConfig.database = "master";
      const p = shared.create(newConfig);
      expect(p).to.eventually.deep.equal({ message: "Database " + newConfig.database + " already exists" }).notify(done);
    });
  });

  describe("drop database", () => {
    it("doesn't explode when it exists", (done) => {
      const p = shared.drop(config, true);
      expect(p).to.eventually.deep.equal({ message: "Database " + config.database + " dropped" }).notify(done);
    });

    it("reports success when it doesn't exist", (done) => {
      let newConfig = extend({}, config);
      newConfig.database = "aslkdjfslkfjasklfjlaksdjflksjfjkl";
      const p = shared.drop(newConfig);
      expect(p).to.eventually.deep.equal({ message: "Database " + newConfig.database + " does not exist" }).notify(done);
    });
  });
});
