var expect = require("chai").expect;

var load_configuration = require("../lib/load_configuration");

describe("load_configuration", function () {
  it("loads config.json", function () {
    var config = load_configuration(__dirname + "/default");
    expect(config).to.not.be.null;
    expect(config.dialect).to.be.equal("mssql");
  });

  it("loads config.js", function () {
    var config = load_configuration(__dirname + "/defaultjs");
    expect(config).to.not.be.null;
    expect(config.database).to.be.equal("sequelize_migration_mssql_extras_developmentjs");
  });

  it("loads config.json via .sequelizerc", function () {
    var config = load_configuration(__dirname + "/sequelizerc");
    expect(config).to.not.be.null;
    expect(config.dialect).to.be.equal("mssql");
  });
});